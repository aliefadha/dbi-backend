const KpiKaryawan = require("../models/kpiKaryawan");  
const Karyawan = require("../models/karyawan");
const { Op } = require("sequelize");
const Kpi = require("../models/kpi");

class KpiKaryawanService {  
  static async create(data) {  
    return await KpiKaryawan.create(data);  
  }  
  
  static async getAll() {  
    return await KpiKaryawan.findAll();  
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
      const startDate = new Date(tahun, bulan - 1, 1);    
      const endDate = new Date(tahun, bulan, 0);    
    
      const kpiKaryawanRecords = await KpiKaryawan.findAll({    
          where: {    
              karyawan_id: id,    
              createdAt: {    
                  [Op.between]: [startDate, endDate]    
              },    
          },    
          include: [    
              {    
                  model: Kpi,    
                  as: 'kpi',    
                  attributes: ['kpi_id', 'nama_kpi', 'persentase', 'waktu']  
              },    
              {  
                  model: Karyawan,  
                  as: 'karyawan',  
                  attributes: ['karyawan_id', 'nama_karyawan', 'bonus']  
              }  
          ]    
      });    
    
      // Grouping the records by kpi_id and nama_kpi    
      const groupedKpi = {};    
      let totalPersentaseTercapai = 0;  
      let totalBonusDiterima = 0;  
    
      kpiKaryawanRecords.forEach(record => {    
          const kpiId = record.kpi.kpi_id; // Get the kpi_id from the record    
          const kpiName = record.kpi.nama_kpi; // Get the nama_kpi from the record    
        
          // Initialize kpiKaryawanList if it doesn't exist  
          const kpiKaryawanList = record.kpiKaryawanList || []; // Ensure it's an array  
        
          let tercapaiHarian = 0;  
          let tidakTercapaiHarian = 0;  
          let persentaseTercapaiHarian = 0;  
          let bonusDiterimaHarian = 0;  
          let tercapaiMingguan = 0;  
          let tidakTercapaiMingguan = 0;  
          let persentaseTercapaiMingguan = 0;  
          let bonusDiterimaMingguan = 0;  
          let tercapaiBulanan = 0;  
          let tidakTercapaiBulanan = 0;  
          let persentaseTercapaiBulanan = 0;  
          let bonusDiterimaBulanan = 0;  
          let bonus = record.karyawan.bonus;  
        
          const totalDaysInMonth = new Date(tahun, bulan, 0).getDate();  
        
          if (record.kpi.waktu === 'Harian') {  
              tercapaiHarian = kpiKaryawanList.length; // Use the initialized array  
              tidakTercapaiHarian = Math.max(0, totalDaysInMonth - tercapaiHarian);  
              persentaseTercapaiHarian = (record.kpi.persentase / totalDaysInMonth) * tercapaiHarian;  
              bonusDiterimaHarian = (persentaseTercapaiHarian / record.kpi.persentase) * bonus; // Adjusted bonus calculation  
        
          } else if (record.kpi.waktu === 'Mingguan') {  
              tercapaiMingguan = kpiKaryawanList.length; // Use the initialized array  
              tidakTercapaiMingguan = Math.max(0, 4 - tercapaiMingguan);  
              persentaseTercapaiMingguan = (record.kpi.persentase / 4) * tercapaiMingguan;  
              bonusDiterimaMingguan = (persentaseTercapaiMingguan / record.kpi.persentase) * bonus; // Adjusted bonus calculation  
        
          } else if (record.kpi.waktu === 'Bulanan') {  
              tercapaiBulanan = kpiKaryawanList.length; // Use the initialized array  
              tidakTercapaiBulanan = Math.max(0, 1 - tercapaiBulanan);  
              persentaseTercapaiBulanan = (record.kpi.persentase / 1) * tercapaiBulanan;  
              bonusDiterimaBulanan = (persentaseTercapaiBulanan / record.kpi.persentase) * bonus; // Adjusted bonus calculation  
          }  
            
          // Create a key based on kpi_id and nama_kpi    
          const kpiKey = `${kpiId}_${kpiName}`;    
    
          // Initialize the array if it doesn't exist    
          if (!groupedKpi[kpiKey]) {    
              groupedKpi[kpiKey] = {    
                  kpi_id: kpiId,    
                  nama_kpi: kpiName,    
                  persentase: record.kpi.persentase,  
                  waktu: record.kpi.waktu,  
                  kpiKaryawanList: []    
              };    
          }    
    
          // Push only the relevant data into the kpiKaryawanList    
          groupedKpi[kpiKey].kpiKaryawanList.push({     
              point_ke: record.point_ke,  
              tercapaiHarian,  
              tidakTercapaiHarian,  
              persentaseTercapaiHarian,  
              bonusDiterimaHarian,  
              tercapaiMingguan,  
              tidakTercapaiMingguan,  
              persentaseTercapaiMingguan,  
              bonusDiterimaMingguan,  
              tercapaiBulanan,  
              tidakTercapaiBulanan,  
              persentaseTercapaiBulanan,  
              bonusDiterimaBulanan  
          });  
    
          // Accumulate total percentage and bonus  
          totalPersentaseTercapai += persentaseTercapaiHarian + persentaseTercapaiMingguan + persentaseTercapaiBulanan;  
          totalBonusDiterima += bonusDiterimaHarian + bonusDiterimaMingguan + bonusDiterimaBulanan;  
      });    
    
      const result = Object.values(groupedKpi);    
    
      return {  
          result,  
          totalPersentaseTercapai,  
          totalBonusDiterima,  
      };  
  }  

}  
  
module.exports = KpiKaryawanService;  
