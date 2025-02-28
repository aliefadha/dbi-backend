const CutiKaryawan = require("../models/cutiKaryawan");  
const { Op } = require("sequelize");
const Karyawan = require("../models/karyawan");
const DivisiKaryawan = require("../models/divisiKaryawan");
  
class CutiKaryawanService {  
  static async create(data) {  
    const tanggalMulai = new Date(data.tanggal_mulai);  
    const tanggalSelesai = new Date(data.tanggal_selesai);  

    // Calculate the number of days between the two dates, inclusive
    const jumlahHari = (tanggalSelesai - tanggalMulai) / (1000 * 60 * 60 * 24) + 1;  

    data.jumlah_cuti = jumlahHari;
    return await CutiKaryawan.create(data);  
  }
  
  static async getAll(bulan, tahun, toko_id) {  
    const whereConditions = {  
      is_deleted: false
    };  
    if (toko_id) {  
      whereConditions.toko_id = toko_id;  
    }
    const startDate = new Date(tahun, bulan - 1, 1);
    const endDate = new Date(tahun, bulan, 0);
    return await Karyawan.findAll({
      where: whereConditions,
      include: [
        {
          model: CutiKaryawan,
          as: "cuti_karyawan",
          where: {
            tanggal_mulai: {
              [Op.lte]: endDate,
            },
            tanggal_selesai: {
              [Op.gte]: startDate,
            },
          },
          order: [['createdAt', 'DESC']]
        }, 
        {
          model: DivisiKaryawan,
          as: "divisi",
          attributes: ["nama_divisi"]
        }
      ]
    });     
  }  
  
  static async getById(id) {  
    return await CutiKaryawan.findByPk(id);
  }  
  
  static async update(id, data) {  
    const cutiKaryawan = await CutiKaryawan.findByPk(id);  
    if (!cutiKaryawan) return null;  
  
    Object.assign(cutiKaryawan, data);  
    await cutiKaryawan.save();  
  
    return cutiKaryawan;  
  }  
  
  static async delete(id) {  
    const cutiKaryawan = await CutiKaryawan.findByPk(id);  
    if (!cutiKaryawan) return null;  
    await cutiKaryawan.destroy();  
    return true;  
  }  

  static async getByKaryawanId(id) {
    return await CutiKaryawan.findAll({where: {karyawan_id: id}});  
  }
}  
  
module.exports = CutiKaryawanService;  
