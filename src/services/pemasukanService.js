const Pemasukan = require("../models/pemasukan");  
  
class PemasukanService {  
  static async create(data) {  
    return await Pemasukan.create(data);  
  }  
  
  static async getAll() {  
    return await Pemasukan.findAll({
      where: {
        is_deleted: false
      }
    });  
  }  
  
  static async getById(id) {  
    return await Pemasukan.findOne({
      where: {
        pemasukan_id: id,
        is_deleted: false
      }
    });  
  }  
  
  static async update(id, data) {  
    const pemasukan = await Pemasukan.findByPk(id);  
    if (!pemasukan) return null;  
  
    Object.assign(pemasukan, data);  
    await pemasukan.save();  
  
    return pemasukan;  
  }  
  
  static async delete(id) {  
    const pemasukan = await Pemasukan.findByPk(id);  
    if (!pemasukan) return null;  
    await pemasukan.update({ is_deleted: true });  
    return true;  
  }  
}  
  
module.exports = PemasukanService;  
