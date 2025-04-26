const AbsensiKaryawan = require("../models/absensiKaryawan"); 
const Karyawan = require("../models/karyawan"); 
const DivisiKaryawan = require("../models/divisiKaryawan");
const DataKaryawanService = require("./dataKaryawanService");
const XLSX = require('xlsx');

class AbsensiKaryawanService {  
  static async create(data) {  
    const karyawanData = await Karyawan.findOne({where: {karyawan_id: data.karyawan_id}});
    if (!karyawanData) {  
        throw new Error("Karyawan not found");  
    } 
    let gajiPokokPerhari;
    let gajiPokokPermenit;
    let gajiPokokPerantar;  
  
    if (karyawanData.waktu_kerja_sebulan_antar) {  
        gajiPokokPerantar = karyawanData.jumlah_gaji_pokok / karyawanData.waktu_kerja_sebulan_antar;  
        gajiPokokPerhari = gajiPokokPerantar;
    } else if (karyawanData.waktu_kerja_sebulan_menit) {
        gajiPokokPermenit = karyawanData.jumlah_gaji_pokok / karyawanData.waktu_kerja_sebulan_menit; 
        gajiPokokPerhari = gajiPokokPermenit * data.total_menit; 
        const tanggalAbsen = new Date(data.tanggal); // Assuming data.tanggal_absen is provided in the data
        if (tanggalAbsen.getDay() === 6) { // 6 represents Saturday
            gajiPokokPerhari -= 60 * gajiPokokPermenit; // Subtract 60 minutes worth of pay
        }
    }  else {
        gajiPokokPerhari = 0;
    }

    const roundedGajiPokokPerhari = Math.round(gajiPokokPerhari)
  
    data.gaji_pokok_perhari = roundedGajiPokokPerhari; 
    
     // Generate Google Maps link
     const googleMapsLink = `https://www.google.com/maps/place/?q=${data.lat},${data.lng}`;
     data.gmaps = googleMapsLink;
  
    return await AbsensiKaryawan.create(data); 
  }  

  static async getAllByKaryawan(karyawanId) {
    const karyawan = await Karyawan.findByPk(karyawanId);
  
    const absensiRecord = await AbsensiKaryawan.findAll({
      where: {
        karyawan_id: karyawanId
      },
      attributes: {
        exclude: ['createdAt', 'updatedAt', 'gaji_pokok_perhari']
      },
      order: [['tanggal', 'ASC'], ['jam_masuk', 'ASC']]
    });
  
    // Jika bukan 'Umum', kembalikan langsung
    if (karyawan.jenis_karyawan !== 'Umum') {
      return absensiRecord;
    }
  
    // Jika 'Umum', lakukan penggabungan berdasarkan tanggal
    const grouped = {};
    
    absensiRecord.forEach(absen => {
        const date = absen.tanggal.toISOString().split('T')[0];

        if (!grouped[date]) {
            grouped[date] = [];
        }

        let currentGroup = grouped[date][grouped[date].length - 1];

        if (!currentGroup || (currentGroup.jam_masuk && currentGroup.jam_keluar)) {
            // Buat group baru kalau perlu
            currentGroup = {
                tanggal: date,
                jam_masuk: null,
                jam_keluar: null,
                total_menit: 0,
                total_gaji_pokok: 0,
            };
            grouped[date].push(currentGroup);
        }

        const absenJam = absen.jam_masuk || absen.jam_keluar;

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
    });
    
    const mergedAbsensi = Object.values(grouped).flat();
  
    return mergedAbsensi;
  }
  
  
  static async getAll(bulan, tahun, toko_id, cabang, divisi) {  
      const whereConditions = {
          is_deleted: false
      }

      if (toko_id) {
          whereConditions.toko_id = toko_id
      }

      if (cabang) {
          whereConditions.cabang_id = cabang
      }

      if (divisi) {
          whereConditions.divisi_karyawan_id = divisi
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
    const karyawanData = await Karyawan.findOne({where: {karyawan_id: absensiKaryawan.karyawan_id}});
    if (!karyawanData) {  
        throw new Error("Karyawan not found");  
    } 
    let gajiPokokPerhari;
    let gajiPokokPermenit;
    let gajiPokokPerantar;  
  
    if (!karyawanData.waktu_kerja_sebulan_menit) {  
        gajiPokokPerantar = karyawanData.jumlah_gaji_pokok / karyawanData.waktu_kerja_sebulan_antar;  
        gajiPokokPerhari = gajiPokokPerantar;
    } else if (karyawanData.waktu_kerja_sebulan_menit) {
       
        gajiPokokPermenit = karyawanData.jumlah_gaji_pokok / karyawanData.waktu_kerja_sebulan_menit; 
        gajiPokokPerhari = gajiPokokPermenit * data.total_menit; 
    }  
    data.gaji_pokok_perhari = Math.round(gajiPokokPerhari)

     // Generate Google Maps link
     const googleMapsLink = `https://www.google.com/maps/place/?q=${data.lat},${data.lng}`;
     data.gmaps = googleMapsLink;
  
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

  static async exportToExcel(bulan, tahun, toko_id, cabang, divisi) {
    const result = await this.getAll(bulan, tahun, toko_id, cabang, divisi);
    const data = result.map((item) => ({
      nama_karyawan: item.karyawan.nama_karyawan,
      divisi: item.karyawan.divisi ? item.karyawan.divisi.nama_divisi : '',
      cabang: item.karyawan.cabang ? item.karyawan.cabang.nama_cabang : '',
      absen: item.kehadiran,
      kpi: `${item.totalPersentaseTercapai}%`, 
      total_gaji_akhir: `Rp${item.totalGajiAkhir.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`
    }));
    
    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.json_to_sheet(data);
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Absensi Karyawan');

    return workbook;
  }
}  
  
module.exports = AbsensiKaryawanService;  
