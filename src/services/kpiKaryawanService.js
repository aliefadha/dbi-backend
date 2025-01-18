const KpiKaryawan = require("../models/kpiKaryawan");  
const Karyawan = require("../models/karyawan");
const { Op } = require("sequelize");
const Kpi = require("../models/kpi");
const KpiService = require("./kpiService");
const Cabang = require("../models/cabang");
const DivisiKaryawan = require("../models/divisiKaryawan");
// const AbsensiKaryawanService = require("./absensiKaryawanService");
const DataKaryawanService = require("./dataKaryawanService");

class KpiKaryawanService {  
  static async create(data) {  
    return await KpiKaryawan.create(data);  
  }  
  
  static async getAll(bulan, tahun) {      
      // Fetch the KPI count by division    
      const kpiByDivisi = await KpiService.getKpiByDivisi();    
      // Create a mapping of divisi_id to kpi_count    
      const kpiCountMap = {};    
      kpiByDivisi.forEach(divisi => {    
          kpiCountMap[divisi.divisi_karyawan_id] = divisi.kpi_count;    
      });    
      
      // Fetch all employees with their divisions and branches    
      const karyawanList = await Karyawan.findAll({    
          include: [    
              {    
                  model: DivisiKaryawan,    
                  as: "divisi",    
                  attributes: ["divisi_karyawan_id", "nama_divisi"],    
              },    
              {    
                  model: Cabang,    
                  as: "cabang",    
                  attributes: ["cabang_id", "nama_cabang"],    
              },    
              {    
                  model: Cabang,    
                  as: "cabang_first",    
                  attributes: ["cabang_id", "nama_cabang"],    
              },    
          ],    
      });    
      
      // Map the results to include kpi_count and total gaji akhir for each employee    
      const results = await Promise.all(karyawanList.map(async karyawan => {    
          const karyawanId = karyawan.karyawan_id;    
          const divisiId = karyawan.divisi_karyawan_id; // Get the divisi_id from the employee    
          const kpiCount = kpiCountMap[divisiId] || 0; // Get the kpi_count from the map, default to 0 if not found    
            
          // Await the result of getDataAbsensiByKaryawan  
          const data = await DataKaryawanService.getDataAbsensiByKaryawan(karyawanId, bulan, tahun);  
          const gajiAkhir = data.totalGajiAkhir; // Access totalGajiAkhir from the data  
    
          return {    
              karyawan_id: karyawan.karyawan_id,    
              nama_karyawan: karyawan.nama_karyawan,    
              divisi: karyawan.divisi.nama_divisi,    
              cabang: karyawan.cabang.nama_cabang,    
              cabang_first: karyawan.cabang_first.nama_cabang,    
              kpi_count: kpiCount, // Add the kpi_count to the result    
              total_gaji_akhir: gajiAkhir // Add total gaji akhir to the result  
          };    
      }));    
      
      return results; // Return the array of results    
  }  


  static async getById(id) {  
    return await KpiKaryawan.findByPk(id);  
  }  
  
  static async update(id, data) {  
    const kpiKaryawan = await KpiKaryawan.findByPk(id);  
    if (!kpiKaryawan) return null;  
  
    Object.assign(kpiKaryawan, data);  
    await kpiKaryawan.save();  
  
    return kpiKaryawan;  
  }  
  
  static async delete(id) {  
    const kpiKaryawan = await KpiKaryawan.findByPk(id);  
    if (!kpiKaryawan) return null;  
    await kpiKaryawan.destroy();  
    return true;  
  }  

  static async getByKaryawanId(id, bulan, tahun) {      
    return await DataKaryawanService.getByKaryawanId(id, bulan, tahun);
    }  


}  
  
module.exports = KpiKaryawanService;  
