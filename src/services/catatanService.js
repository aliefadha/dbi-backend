const Catatan = require("../models/catatan");  
const { Op } = require("sequelize");
const XLSX = require('xlsx');
const Toko = require("../models/toko");
class CatatanService {  
  static async create(data) {  
    return await Catatan.create(data);  
  }  
  
  static async getAll(bulan, tahun, toko_id) {
    const startDate = new Date(tahun, bulan-1, 1);
    const endDate = new Date(tahun, bulan, 0); 
    endDate.setHours(23, 59, 59, 999);
    const whereConditions = {
      is_deleted: false,
      tanggal: {
        [Op.between]: [startDate, endDate]
      }
    } 

    if (toko_id) {
      whereConditions.toko_id = toko_id
    }
    return await Catatan.findAll(
      {
        where: whereConditions,
        attributes: {
          exclude: ["is_deleted"],
        },
        include: {
          model: Toko,
          as: "toko",
          attributes: ["nama_toko"]
        },
        order: [['createdAt', 'DESC']]
      }
    );  
  }  
  
  static async getById(id) {  
    return await Catatan.findByPk(id);  
  }  
  
  static async update(id, data) {  
    const catatan = await Catatan.findByPk(id);  
    if (!catatan) return null;  
  
    Object.assign(catatan, data);  
    await catatan.save();  
  
    return catatan;  
  }  
  
  static async delete(id) {  
    const catatan = await Catatan.findByPk(id);  
    if (!catatan) return null;  
    await catatan.update({ is_deleted: true });  
    return true;  
  }  

  static async exportToExcel(bulan, tahun) {
    const catatan = await this.getAll(bulan, tahun);

    const data = catatan.map((item) => ({
      tanggal: item.tanggal,
      nama: item.nama,
      judul: item.judul,
      isi: item.isi,
    }));
    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.json_to_sheet(data);
    XLSX.utils.book_append_sheet(workbook, worksheet, "catatan");
    return workbook;
  }
}  
  
module.exports = CatatanService;  
