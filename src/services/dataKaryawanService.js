const AbsensiKaryawan = require("../models/absensiKaryawan"); 
const Karyawan = require("../models/karyawan"); 
const DivisiKaryawan = require("../models/divisiKaryawan");
const Cabang = require("../models/cabang");
const { Op } = require("sequelize");
const CutiKaryawan = require("../models/cutiKaryawan");
const KpiKaryawan = require("../models/kpiKaryawan");
const Kpi = require("../models/kpi");

class DataKaryawanService {
    static async getListAbsensiByKaryawan(id, bulan, tahun) {
        const startDate = new Date(tahun, bulan - 1, 1);
        const endDate = new Date(tahun, bulan, 0);
    
        const absensiRecord = await AbsensiKaryawan.findAll({
          where: {
            karyawan_id: id,
            tanggal: {
              [Op.between]: [startDate, endDate]
            },
          }
        });
    
        let totalGajiPokok = 0;
        let totalMenit = 0;
    
        absensiRecord.forEach((absensi) => {
          totalGajiPokok += absensi.gaji_pokok_perhari;
          totalMenit += absensi.total_menit;
        });
    
        return {
          absensiRecord, 
          totalGajiPokok,
          totalMenit,
        };
    }

    static async getDataAbsensiByKaryawan(id, bulan, tahun) {
        const startDate = new Date(tahun, bulan - 1, 1);
        const endDate = new Date(tahun, bulan, 0);

        const karyawan = await Karyawan.findOne({
        where: {karyawan_id: id},
        include: [
            {
            model: Cabang,
            as: 'cabang',
            attributes: ['nama_cabang']
            },
            {
            model: Cabang,
            as: 'cabang_first',
            attributes: ['nama_cabang']
            },
            {
            model: DivisiKaryawan,
            as: 'divisi',
            attributes: ['nama_divisi']
            }
        ]});

        const kehadiran = await AbsensiKaryawan.count({
        where: {
            karyawan_id: id,
            tanggal: {
            [Op.between]: [startDate, endDate]
            },
        }
        })

        const cutiKaryawanRecords = await CutiKaryawan.findAll({  
            where: {  
                karyawan_id: id,  
                tanggal_mulai: {  
                    [Op.lte]: endDate // Start date should be less than or equal to end of the month  
                },  
                tanggal_selesai: {  
                    [Op.gte]: startDate // End date should be greater than or equal to start of the month  
                }  
            }  
        });  
        let totalCutiDays = 0;  
        
        // Calculate the number of days of leave that fall within the specified month  
        for (const cutiKaryawan of cutiKaryawanRecords) {  
            const cutiStart = new Date(cutiKaryawan.tanggal_mulai);  
            const cutiEnd = new Date(cutiKaryawan.tanggal_selesai);  
    
            // Calculate the actual start and end dates for the overlap  
            const overlapStart = cutiStart < startDate ? startDate : cutiStart;  
            const overlapEnd = cutiEnd > endDate ? endDate : cutiEnd;  
    
            // Calculate the number of overlapping days  
            const cutiDays = Math.max(0, (overlapEnd - overlapStart) / (1000 * 60 * 60 * 24) + 1); // +1 to include the end day  
            totalCutiDays += cutiDays; // Accumulate the total cuti days  
        }  

        let tidakHadir = Math.max(0, 28 - totalCutiDays - kehadiran);

        const { totalPersentaseTercapai, totalBonusDiterima } = await this.getByKaryawanId(id, bulan, tahun);  

        const { totalGajiPokok, totalMenit } = await this.getListAbsensiByKaryawan(id, bulan, tahun);

        const totalGajiAkhir = totalGajiPokok + totalBonusDiterima;

        return {  
            karyawan,  
            kehadiran,  
            totalCutiDays,
            tidakHadir,
            totalGajiPokok,
            totalMenit,
            totalPersentaseTercapai,
            totalBonusDiterima,
            totalGajiAkhir
        };
    }

    static async getByKaryawanId(id, bulan, tahun){
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

module.exports = DataKaryawanService;