const AbsensiKaryawan = require("../models/absensiKaryawan"); 
const Karyawan = require("../models/karyawan"); 
const DivisiKaryawan = require("../models/divisiKaryawan");
const Cabang = require("../models/cabang");
const { Op } = require("sequelize");
const CutiKaryawan = require("../models/cutiKaryawan");
  
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
  
  static async getAll() {  
    return await AbsensiKaryawan.findAll();  
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

  static async getAbsensiByKaryawan(id, bulan, tahun){
    const startDate = new Date(tahun, bulan - 1, 1);
    const endDate = new Date(tahun, bulan, 0);

    const karyawan = await Karyawan.findOne({
      where: {karyawan_id: id},
      include: [
        {
          model: AbsensiKaryawan,
          as: 'absensi_karyawan',
          where: {
            tanggal: {
              [Op.between]: [startDate, endDate]              
            }
          }
        },
        {
          model: DivisiKaryawan,
          as: 'divisi',
          attributes: ['nama_divisi']
        },
        {
          model: Cabang,
          as: 'cabang',
          attributes: ['nama_cabang']
        },
        {
          model: Cabang,
          as: 'cabang_first',
          attributes: ['nama_cabang']
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

    let tidakHadir = 28 - totalCutiDays - kehadiran;
  
    // Return the karyawan data along with the absensi count and total cuti days  
    return {  
        karyawan,  
        kehadiran,  
        totalCutiDays,
        tidakHadir 
    };  
  }
}  
  
module.exports = AbsensiKaryawanService;  
