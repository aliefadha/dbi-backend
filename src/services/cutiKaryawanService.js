const CutiKaryawan = require("../models/cutiKaryawan");  
  
class CutiKaryawanService {  
  static async create(data) {  
    return await CutiKaryawan.create(data);  
  }  
  
  static async getAll() {  
    const cutiKaryawanList = await CutiKaryawan.findAll();    
    return cutiKaryawanList.map(cuti => {  
        const tanggalMulai = new Date(cuti.tanggal_mulai);  
        const tanggalSelesai = new Date(cuti.tanggal_selesai);  
        const jumlahHari = (tanggalSelesai - tanggalMulai) / (1000 * 60 * 60 * 24);  
  
        return {  
          cuti_karyawan_id: cuti.cuti_karyawan_id,  
          karyawan_id: cuti.karyawan_id,  
          tanggal_mulai: cuti.tanggal_mulai,  
          tanggal_selesai: cuti.tanggal_selesai,  
          alasan: cuti.alasan,  
          status: cuti.status,  
          jumlah_hari: jumlahHari  
      };  
    });  
  }  
  
  static async getById(id) {  
    const cutiKaryawan = await CutiKaryawan.findByPk(id);
    const tanggalMulai = new Date(cutiKaryawan.tanggal_mulai);
    const tanggalSelesai = new Date(cutiKaryawan.tanggal_selesai);
    const jumlahHari = (tanggalSelesai - tanggalMulai) / (1000 * 60 * 60 * 24); 

    return {  
      cuti_karyawan_id: cutiKaryawan.cuti_karyawan_id,  
      karyawan_id: cutiKaryawan.karyawan_id,  
      tanggal_mulai: cutiKaryawan.tanggal_mulai,  
      tanggal_selesai: cutiKaryawan.tanggal_selesai,  
      alasan: cutiKaryawan.alasan,  
      status: cutiKaryawan.status,  
      jumlah_hari: jumlahHari 
  };  

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
}  
  
module.exports = CutiKaryawanService;  
