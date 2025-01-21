const MetodePembayaranGudang = require("../models/metodePembayaranGudang");  
  
class MetodePembayaranGudangService {  
  static async create(data) {  
    return await MetodePembayaranGudang.create(data);  
  }  
  
  static async getAll() {  
    return await MetodePembayaranGudang.findAll({
      where: {
        is_deleted: false
      }
    });  
  }  
  
  static async getById(id) {  
    return await MetodePembayaranGudang.findOne({
      where: {
        metode_id: id,
        is_deleted: false
      }
    });  
  }  
  
  static async update(id, data) {  
    const metodePembayaranGudang = await MetodePembayaranGudang.findByPk(id);  
    if (!metodePembayaranGudang) return null;  
  
    Object.assign(metodePembayaranGudang, data);  
    await metodePembayaranGudang.save();  
  
    return metodePembayaranGudang;  
  }  
  
  static async delete(id) {  
    const metodePembayaranGudang = await MetodePembayaranGudang.findByPk(id);  
    if (!metodePembayaranGudang) return null;  
    await metodePembayaranGudang.update({ is_deleted: true });  
    return true;  
  }  
}  
  
module.exports = MetodePembayaranGudangService;  
