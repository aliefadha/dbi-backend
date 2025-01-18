const AbsensiKaryawan = require("../models/absensiKaryawan"); 
const Karyawan = require("../models/karyawan"); 
const DivisiKaryawan = require("../models/divisiKaryawan");
const Cabang = require("../models/cabang");
const { Op } = require("sequelize");
const CutiKaryawan = require("../models/cutiKaryawan");
const DataKaryawanService = require("./dataKaryawanService");

class AbsensiKaryawanService {  
  static async create(data) {  
    const karyawanData = await Karyawan.findOne({where: {karyawan_id: data.karyawan_id}});
    if (!karyawanData) {  
        throw new Error("Karyawan not found");  
    } 
    let gajiPokokPerhari;
    let gajiPokokPermenit;
    let gajiPokokPerantar;  
  
    if (!karyawanData.waktu_kerja_sebulan_menit) {  
        gajiPokokPerantar = karyawanData.jumlah_gaji_pokok / karyawanData.waktu_kerja_sebulan_antar;  
        gajiPokokPerhari = gajiPokokPerantar;
    } else {  
        gajiPokokPermenit = karyawanData.jumlah_gaji_pokok / karyawanData.waktu_kerja_sebulan_menit; 
        gajiPokokPerhari = gajiPokokPermenit * data.total_menit; 
    }  
  
    data.gaji_pokok_perhari = gajiPokokPerhari;  
  
    return await AbsensiKaryawan.create(data); 
  }  
  
  static async getAll(bulan, tahun) {  
      const karyawanList = await Karyawan.findAll();  
    
      // Initialize an array to hold the results  
      const results = [];  
    
      // Iterate through each employee  
      for (const karyawan of karyawanList) {  
          const id = karyawan.karyawan_id;
    
          // Call the getDataAbsensiByKaryawan function for each employee  
          const data = await DataKaryawanService.getDataAbsensiByKaryawan(id, bulan, tahun);  

          results.push(data);  
      }  
    
      return results; 
  }  

  
  static async getById(id) {  
    return await AbsensiKaryawan.findByPk(id);  
  }  
  
  static async update(id, data) {  
    const absensiKaryawan = await AbsensiKaryawan.findByPk(id);  
    if (!absensiKaryawan) return null;  
  
    Object.assign(absensiKaryawan, data);  
    await absensiKaryawan.save();  
  
    return absensiKaryawan;  
  }  
  
  static async delete(id) {  
    const absensiKaryawan = await AbsensiKaryawan.findByPk(id);  
    if (!absensiKaryawan) return null;  
    await absensiKaryawan.destroy();  
    return true;  
  }  

  static async test(){
    return 'a';
  }

  static async getListAbsensiByKaryawan(id, bulan, tahun){
    return await DataKaryawanService.getListAbsensiByKaryawan(id, bulan, tahun);
  }

  static async getDataAbsensiByKaryawan(id, bulan, tahun){
    return await DataKaryawanService.getDataAbsensiByKaryawan(id, bulan, tahun);
  }
}  
  
module.exports = AbsensiKaryawanService;  
