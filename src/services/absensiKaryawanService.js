const AbsensiKaryawan = require("../models/absensiKaryawan");  
  
class AbsensiKaryawanService {  
  static async create(data) {  
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
}  
  
module.exports = AbsensiKaryawanService;  
