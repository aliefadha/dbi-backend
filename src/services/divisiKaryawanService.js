const DivisiKaryawan = require("../models/divisiKaryawan");  
const Karyawan = require("../models/karyawan");
  
class DivisiKaryawanService {  
  static async create(data) {  
    return await DivisiKaryawan.create(data);  
  }  
  
  static async getAll() {  
    return await DivisiKaryawan.findAll();  
  }  
  
  static async getById(id) {  
    return await DivisiKaryawan.findByPk(id);  
  }  
  
  static async update(id, data) {  
    const divisiKaryawan = await DivisiKaryawan.findByPk(id);  
    if (!divisiKaryawan) return null;  
  
    Object.assign(divisiKaryawan, data);  
    await divisiKaryawan.save();  
  
    return divisiKaryawan;  
  }  
  
  static async delete(id) {  
    const divisiKaryawan = await DivisiKaryawan.findByPk(id);  
    if (!divisiKaryawan) return null;  
    await divisiKaryawan.update({ is_deleted: true });  
    return true;  
  }  

  static async getKaryawanByDivisi(id) {
      return await DivisiKaryawan.findByPk(id, {
          include: {
              model: Karyawan,
              as: 'karyawan'
          }
      });
  }
}  
  
module.exports = DivisiKaryawanService;  
