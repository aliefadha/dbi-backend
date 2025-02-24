const AbsensiKaryawan = require("../models/absensiKaryawan"); 
const Karyawan = require("../models/karyawan"); 
const DivisiKaryawan = require("../models/divisiKaryawan");
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

    const roundedGajiPokokPerhari = Math.round(gajiPokokPerhari)
  
    data.gaji_pokok_perhari = roundedGajiPokokPerhari;  
  
    return await AbsensiKaryawan.create(data); 
  }  

  static async getAllByKaryawan(karyawanId) {
    return await AbsensiKaryawan.findAll({
      where: {
        karyawan_id: karyawanId
      },
      attributes: {
        exclude: ['createdAt', 'updatedAt', 'gaji_pokok_perhari']
      }
    });
  }
  
  static async getAll(bulan, tahun, toko_id) {  
      const whereConditions = {
          is_deleted: false
      }

      if (toko_id) {
          whereConditions.toko_id = toko_id
      }
      const karyawanList = await Karyawan.findAll({
          where: whereConditions
      });  
    
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
    data.gaji_pokok_perhari = Math.round(gajiPokokPerhari)
  
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

  static async getListAbsensiByKaryawan(id, bulan, tahun){
    return await DataKaryawanService.getListAbsensiByKaryawan(id, bulan, tahun);
  }

  static async getDataAbsensiByKaryawan(id, bulan, tahun){
    return await DataKaryawanService.getDataAbsensiByKaryawan(id, bulan, tahun);
  }

  static async getManagerAbsensi(bulan, tahun) {
      const karyawanList = await Karyawan.findAll({
          include: [
            {
              model: DivisiKaryawan,
              as: "divisi",
              attributes: ["nama_divisi"]
            }
          ]
      });  
      const allowedDivisiNames = ["Manager", "Finance", "SPV", "Head Gudang"];
      // Initialize an array to hold the results  
      const results = [];  

      // Iterate through each employee  
      for (const karyawan of karyawanList) {  
          // Check if the divisi of the employee is in the allowed list
          if (karyawan.divisi && allowedDivisiNames.includes(karyawan.divisi.nama_divisi)) {
              const id = karyawan.karyawan_id;

              // Call the getDataAbsensiByKaryawan function for each employee  
              const data = await DataKaryawanService.getDataAbsensiByKaryawan(id, bulan, tahun);  

              // Add the data to the results if it exists
              if (data) {
                  results.push(data);  
              }
          }
      }  

      return results; 
  }
}  
  
module.exports = AbsensiKaryawanService;  
