const AbsensiKaryawan = require("../models/absensiKaryawan"); 
const Karyawan = require("../models/karyawan"); 
const DivisiKaryawan = require("../models/divisiKaryawan");
const Cabang = require("../models/cabang");
const { Op, Sequelize } = require("sequelize");
const CutiKaryawan = require("../models/cutiKaryawan");
const KpiKaryawan = require("../models/kpiKaryawan");
const Kpi = require("../models/kpi");
const Toko = require("../models/toko");

class DataKaryawanService {
   static async getDataAbsensiByKaryawan(id, bulan, tahun) {
        // Rentang tanggal pakai waktu lokal (Jakarta)
        const startDate = new Date(tahun, bulan - 1, 1, 0, 0, 0, 0);
        const endDate   = new Date(tahun, bulan, 0, 23, 59, 59, 999);

        const karyawan = await Karyawan.findOne({
            where: { karyawan_id: id },
            include: [
            { model: Toko, as: 'toko', attributes: ['nama_toko'] },
            { model: Cabang, as: 'cabang', attributes: ['nama_cabang'] },
            { model: Cabang, as: 'cabang_first', attributes: ['nama_cabang'] },
            { model: DivisiKaryawan, as: 'divisi', attributes: ['nama_divisi'] },
            ],
        });

        const kehadiran = await AbsensiKaryawan.count({
            where: {
            karyawan_id: id,
            tanggal: { [Op.between]: [startDate, endDate] },
            },
            distinct: true,
            col: 'tanggal',
        });

        // --- Hitung Cuti yang Overlap Bulan Tertentu ---
        const cutiKaryawanRecords = await CutiKaryawan.findAll({
            where: {
            karyawan_id: id,
            tanggal_mulai: { [Op.lte]: endDate },
            tanggal_selesai: { [Op.gte]: startDate },
            status: 'Diterima',
            },
        });

        let totalCutiDays = 0;
        for (const cuti of cutiKaryawanRecords) {
            const cutiStart = new Date(cuti.tanggal_mulai);
            const cutiEnd   = new Date(cuti.tanggal_selesai);
            const overlapStart = cutiStart < startDate ? startDate : cutiStart;
            const overlapEnd   = cutiEnd > endDate ? endDate : cutiEnd;
            const days = Math.max(0, Math.floor((overlapEnd - overlapStart) / (1000 * 60 * 60 * 24)) + 1);
            totalCutiDays += days;
        }
        const totalDaysInMonth = new Date(tahun, bulan, 0).getDate();
        totalCutiDays = Math.min(Math.floor(totalCutiDays), totalDaysInMonth);

        let tidakHadir = Math.max(0, 28 - totalCutiDays - kehadiran);
        tidakHadir = Math.floor(tidakHadir);

        // --- Ambil list absensi + total menit & gaji dasar (sudah dibersihkan) ---
        const { totalGajiPokok: totalGajiPokokFromList, totalMenit } =
            await this.getListAbsensiByKaryawan(id, bulan, tahun);

        // --- FINALISASI GAJI POKOK ---
        // Untuk 'Umum': base = prorata(rate * totalMenit), di-cap ke jumlah_gaji_pokok
        // Untuk selain 'Umum': pakai hasil penjumlahan dari per-hari (yang sudah di-clamp >= 0)
        let finalTotalGajiPokok = totalGajiPokokFromList;

        if (karyawan?.jenis_karyawan === 'Umum') {
            const baseGaji   = Number(karyawan.jumlah_gaji_pokok) || 0;
            const targetMenit = Number(karyawan.waktu_kerja_sebulan_menit) || 0;
            if (baseGaji > 0 && targetMenit > 0) {
            const ratePerMinute = baseGaji / targetMenit;
            const prorated = Math.floor(ratePerMinute * totalMenit);
            finalTotalGajiPokok = Math.min(prorated, baseGaji);
            } else {
            // fallback kalau data target/base tidak valid
            finalTotalGajiPokok = Math.max(0, finalTotalGajiPokok);
            }
        }

        // Bonus & KPI (biarkan seperti semula)
        const { totalPersentaseTercapai, totalBonusDiterima } = await this.getByKaryawanId(id, bulan, tahun);

        const totalGajiAkhirRaw = finalTotalGajiPokok + totalBonusDiterima;

        const roundedTotalPersentaseTercapai = parseFloat(Number(totalPersentaseTercapai).toFixed(2));
        const roundedTotalBonusDiterima = Math.round((Number(totalBonusDiterima) || 0) / 1000) * 1000;
        const roundedTotalGajiAkhir = Math.round(totalGajiAkhirRaw / 1000) * 1000;

        return {
            karyawan,
            kehadiran,
            totalCutiDays,
            tidakHadir,
            totalGajiPokok: finalTotalGajiPokok,
            totalMenit,
            totalPersentaseTercapai: roundedTotalPersentaseTercapai,
            totalBonusDiterima: roundedTotalBonusDiterima,
            totalGajiAkhir: roundedTotalGajiAkhir,
        };
        }

        static async getListAbsensiByKaryawan(id, bulan, tahun) {
        // Rentang tanggal pakai waktu lokal (Jakarta)
        const startDate = new Date(tahun, bulan - 1, 1, 0, 0, 0, 0);
        const endDate   = new Date(tahun, bulan, 0, 23, 59, 59, 999);

        const karyawan = await Karyawan.findByPk(id);

        const absensiRecordRaw = await AbsensiKaryawan.findAll({
            where: {
            karyawan_id: id,
            tanggal: { [Op.between]: [startDate, endDate] },
            },
            order: [
            ['tanggal', 'ASC'],
            [Sequelize.literal('CASE WHEN jam_masuk IS NULL THEN 1 ELSE 0 END'), 'ASC'],
            ['jam_masuk', 'ASC'],
            ['jam_keluar', 'ASC'],
            ],
        });

        // Helpers (inline—tidak perlu dideklarasi global)
        const toLocalDateStr = (d) => {
            const dt = new Date(d);
            const y = dt.getFullYear();
            const m = String(dt.getMonth() + 1).padStart(2, '0');
            const day = String(dt.getDate()).padStart(2, '0');
            return `${y}-${m}-${day}`;
        };
        const normalizeMinutes = (menit) => {
            if (menit == null || isNaN(menit)) return 0;
            // jika DB kadang menyimpan menit negatif untuk shift lintas hari
            return menit < 0 ? menit + 24 * 60 : menit;
        };

        // --- Kelompokkan per tanggal untuk tampilan per hari (tetap sederhana & stabil) ---
        const grouped = {};
        let totalMenit = 0;
        let totalGajiPokokNonUmum = 0; // sum harian untuk non-Umum (clamped >= 0)

        for (const absen of absensiRecordRaw) {
            const dateKey = toLocalDateStr(absen.tanggal);
            if (!grouped[dateKey]) grouped[dateKey] = [];

            // pilih grup aktif (hari yang sama)
            let currentGroup = grouped[dateKey][grouped[dateKey].length - 1];
            if (!currentGroup || (currentGroup.jam_masuk && currentGroup.jam_keluar)) {
            currentGroup = {
                tanggal: dateKey,
                jam_masuk: null,
                jam_keluar: null,
                total_menit: 0,
                total_gaji_pokok: 0,
            };
            grouped[dateKey].push(currentGroup);
            }

            // catat jam masuk/keluar kalau ada
            if (absen.jam_masuk && !currentGroup.jam_masuk) {
            currentGroup.jam_masuk = {
                jam: absen.jam_masuk,
                foto: absen.image,
                lokasi: absen.gmaps,
                absensi_karyawan_id: absen.absensi_karyawan_id,
            };
            } else if (absen.jam_keluar && !currentGroup.jam_keluar) {
            currentGroup.jam_keluar = {
                jam: absen.jam_keluar,
                foto: absen.image,
                lokasi: absen.gmaps,
                absensi_karyawan_id: absen.absensi_karyawan_id,
            };
            }

            // akumulasi menit dari field DB (distandarkan)
            const menit = normalizeMinutes(absen.total_menit);
            currentGroup.total_menit += menit;
            totalMenit += menit;

            // untuk non-Umum saja, tetap jumlahkan gaji_pokok_perhari dari DB (clamp >= 0)
            if (karyawan?.jenis_karyawan !== 'Umum') {
            const dailyFromDb = Math.max(0, Number(absen.gaji_pokok_perhari) || 0);
            currentGroup.total_gaji_pokok += dailyFromDb;
            totalGajiPokokNonUmum += dailyFromDb;
            }
        }

        // Flatten hasil grup
        const mergedAbsensi = Object.values(grouped).flat();

        // --- Distribusi gaji pokok untuk 'Umum': prorata menit per hari, di-cap total base ---
        let totalGajiPokok = totalGajiPokokNonUmum;

        if (karyawan?.jenis_karyawan === 'Umum') {
            const baseGaji   = Number(karyawan.jumlah_gaji_pokok) || 0;
            const targetMenit = Number(karyawan.waktu_kerja_sebulan_menit) || 0;

            if (baseGaji > 0 && targetMenit > 0) {
            const ratePerMinute = baseGaji / targetMenit;
            let sisaCap = Math.min(baseGaji, Math.floor(ratePerMinute * totalMenit)); // cap bulanan

            // alokasikan ke masing-masing hari berdasarkan menit hari tsb
            for (const day of mergedAbsensi) {
                if (sisaCap <= 0) {
                day.total_gaji_pokok = 0;
                continue;
                }
                const pay = Math.min(sisaCap, Math.floor((day.total_menit || 0) * ratePerMinute));
                day.total_gaji_pokok = pay;
                sisaCap -= pay;
            }

            totalGajiPokok = baseGaji - sisaCap; // sama dengan min(rate*totalMenit, baseGaji)
            } else {
            // data target/base tidak valid => pakai 0
            totalGajiPokok = 0;
            for (const day of mergedAbsensi) day.total_gaji_pokok = 0;
            }
        }

        return {
            absensiRecord: mergedAbsensi,
            totalGajiPokok,
            totalMenit,
        };
        }

    static async getByKaryawanId(id, bulan, tahun){
        const startDate = new Date(tahun, bulan - 1, 1);      
        const endDate = new Date(tahun, bulan, 0);      
        endDate.setHours(23, 59, 59, 999);
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
                kpi_karyawan_id: record.kpi_karyawan_id,       
                point_ke: record.point_ke,    
            });    
    
            // Increment the count for the number of KpiKaryawan records  
            groupedKpi[kpiKey].count += 1;    
        });      
    
        // Calculate achieved and not achieved based on the count  
        Object.values(groupedKpi).forEach(kpi => {  
            // const totalDaysInMonth = new Date(tahun, bulan, 0).getDate(); 
            const totalDaysInMonth = 28;
            let tercapai = kpi.count; // Use the count directly  
            let tidakTercapai = 0;  
            let persentaseTercapai = 0;  
            let bonusDiterima = 0;  
            let bonus = kpiKaryawanRecords[0].karyawan.bonus; 
    
            if (kpi.waktu === 'Harian') {  
                tidakTercapai = Math.max(0, totalDaysInMonth - tercapai);
                persentaseTercapai = (kpi.persentase / totalDaysInMonth) * tercapai;  
                bonusDiterima = (persentaseTercapai / 100) * bonus; // Adjusted bonus calculation  
            } else if (kpi.waktu === 'Mingguan') {  
                tidakTercapai = Math.max(0, 4 - tercapai);  
                persentaseTercapai = (kpi.persentase / 4) * tercapai;  
                bonusDiterima = (persentaseTercapai / 100) * bonus; // Adjusted bonus calculation  
            } else if (kpi.waktu === 'Bulanan') {  
                tidakTercapai = Math.max(0, 1 - tercapai);  
                persentaseTercapai = (kpi.persentase / 1) * tercapai;  
                bonusDiterima = (persentaseTercapai / 100) * bonus; // Adjusted bonus calculation  
            }  
    
            // Store the calculated values back into the kpi object  
            kpi.tercapai = tercapai;  
            kpi.tidakTercapai = tidakTercapai;  
            kpi.persentaseTercapai = parseFloat(persentaseTercapai.toFixed(2));  
            kpi.bonusDiterima = bonusDiterima;  
    
            // Accumulate total percentage and bonus    
            totalPersentaseTercapai += persentaseTercapai;    
            totalBonusDiterima += bonusDiterima;    
        });  
    
        // Convert groupedKpi to an array for the result  
        const result = Object.values(groupedKpi);  
        return {    
            result,    
            totalPersentaseTercapai: parseFloat(totalPersentaseTercapai.toFixed(2)),    
            totalBonusDiterima: Math.round(totalBonusDiterima / 1000) * 1000, 
        };    
    }

}

module.exports = DataKaryawanService;