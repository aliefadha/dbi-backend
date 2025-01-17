const CutiKaryawan = require("../models/cutiKaryawan");  
const { Op } = require("sequelize");
const Karyawan = require("../models/karyawan");
const DivisiKaryawan = require("../models/divisiKaryawan");
  
class CutiKaryawanService {  
  static async create(data) {  
    const tanggalMulai = new Date(data.tanggal_mulai);  
    const tanggalSelesai = new Date(data.tanggal_selesai);  
    const jumlahHari = (tanggalSelesai - tanggalMulai) / (1000 * 60 * 60 * 24);  
    data.jumlah_cuti = jumlahHari;
    return await CutiKaryawan.create(data);  
  }  
  
  static async getAll(bulan, tahun) {  
    const startDate = new Date(tahun, bulan - 1, 1);
    const endDate = new Date(tahun, bulan, 0);
    return await Karyawan.findAll({
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
          }
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
