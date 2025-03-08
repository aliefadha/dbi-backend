const TargetBulananKasir = require("../models/targetBulananKasir");  
const Cabang = require("../models/cabang");
const Penjualan = require("../models/penjualan");
const { Op } = require("sequelize");

class TargetBulananKasirService {  
  static async create(data) {  
    return await TargetBulananKasir.bulkCreate(data);  
  }  
  
  static async getAll(cabang, tahun) { 
      // Define the months
    const months = [
      "January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"
    ];

    // Initialize the result array
    const result = [];

    // Loop through each month
    for (const bulan of months) {
      // Calculate the start and end dates for the given month and year
      const monthIndex = months.indexOf(bulan) + 1; // Convert month name to index (1-12)
      const startDate = new Date(tahun, monthIndex - 1, 1);
      const endDate = new Date(tahun, monthIndex, 0);

      // Retrieve the target bulanan kasir data for the current month
      const targetBulananKasir = await TargetBulananKasir.findOne({
        where: {
          cabang_id: cabang,
          bulan: bulan,
        },
        include: [
          {
            model: Cabang,
            as: "cabang",
            attributes: ["nama_cabang"],
          },
        ],
        attributes: [
          'target_bulanan_kasir_id',
          'cabang_id',
          'bulan',
          'jumlah_target',
        ],
      });

      // Calculate the sum of total_penjualan for the current month
      const totalPenjualan = await Penjualan.sum('total_penjualan', {
        where: {
          cabang_id: cabang,
          tanggal: {
            [Op.between]: [startDate, endDate]
          }
        }
      });

      // Add the calculated sum to the target bulanan kasir data
      result.push({
        ...targetBulananKasir.get({ plain: true }),
        tercapai: totalPenjualan || 0,
      });
    }

    return result;
  }  
  
  static async getById(id) {  
    return await TargetBulananKasir.findOne({
      where: { target_bulanan_kasir_id: id },
      include: [
        {
          model: Cabang,
          as: "cabang",
          attributes: ["toko_id","nama_cabang","email"],
        },
      ]});  
  }  
  
  static async update(id, data) {  
    const targetBulananKasir = await TargetBulananKasir.findByPk(id);  
    if (!targetBulananKasir) return null;  
  
    Object.assign(targetBulananKasir, data);  
    await targetBulananKasir.save();  
  
    return targetBulananKasir;  
  }  
  
  static async delete(id) {  
    const targetBulananKasir = await TargetBulananKasir.findByPk(id);  
    if (!targetBulananKasir) return null;  
    await targetBulananKasir.destroy();  
    return true;  
  }  

  static async getTargetByCabang(id) {
    return await TargetBulananKasir.findAll({
      where: { cabang_id: id },
      include: [
        {
          model: Cabang,
          as: "cabang",
          attributes: ["toko_id","nama_cabang","email"],
        },
      ]
    })
  }
}  
  
module.exports = TargetBulananKasirService;  
