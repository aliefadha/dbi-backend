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
        const kpiKey = `${kpiId}_${kpiName}`;      
  
        // Initialize the entry if it doesn't exist      
        if (!groupedKpi[kpiKey]) {      
            groupedKpi[kpiKey] = {      
                kpi_id: kpiId,      
                nama_kpi: kpiName,      
                persentase: record.kpi.persentase,    
                waktu: record.kpi.waktu,    
                kpiKaryawanList: [],    
                count: 0 // Initialize count for KpiKaryawan records  
            };      
        }      
  
        // Push the record into the kpiKaryawanList      
        groupedKpi[kpiKey].kpiKaryawanList.push({       
            point_ke: record.point_ke,    
        });    
  
        // Increment the count for the number of KpiKaryawan records  
        groupedKpi[kpiKey].count += 1;    
    });      
  
    // Calculate achieved and not achieved based on the count  
    Object.values(groupedKpi).forEach(kpi => {  
        const totalDaysInMonth = new Date(tahun, bulan, 0).getDate();  
        let tercapai = kpi.count; // Use the count directly  
        let tidakTercapai = 0;  
        let persentaseTercapai = 0;  
        let bonusDiterima = 0;  
        let bonus = kpiKaryawanRecords[0].karyawan.bonus; 
  
        if (kpi.waktu === 'Harian') {  
            tidakTercapai = Math.max(0, totalDaysInMonth - tercapai);
            persentaseTercapai = (kpi.persentase / totalDaysInMonth) * tercapai;  
            bonusDiterima = (persentaseTercapai / kpi.persentase) * bonus; // Adjusted bonus calculation  
        } else if (kpi.waktu === 'Mingguan') {  
            tidakTercapai = Math.max(0, 4 - tercapai);  
            persentaseTercapai = (kpi.persentase / 4) * tercapai;  
            bonusDiterima = (persentaseTercapai / kpi.persentase) * bonus; // Adjusted bonus calculation  
        } else if (kpi.waktu === 'Bulanan') {  
            tidakTercapai = Math.max(0, 1 - tercapai);  
            persentaseTercapai = (kpi.persentase / 1) * tercapai;  
            bonusDiterima = (persentaseTercapai / kpi.persentase) * bonus; // Adjusted bonus calculation  
        }  
  
        // Store the calculated values back into the kpi object  
        kpi.tercapai = tercapai;  
        kpi.tidakTercapai = tidakTercapai;  
        kpi.persentaseTercapai = persentaseTercapai;  
        kpi.bonusDiterima = bonusDiterima;  
  
        // Accumulate total percentage and bonus    
        totalPersentaseTercapai += persentaseTercapai;    
        totalBonusDiterima += bonusDiterima;    
    });  
  
    // Convert groupedKpi to an array for the result  
    const result = Object.values(groupedKpi);  
    return {    
        result,    
        totalPersentaseTercapai,    
        totalBonusDiterima,    
    };    
}  


}  
  
module.exports = KpiKaryawanService;  
