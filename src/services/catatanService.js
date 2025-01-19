const Catatan = require("../models/catatan");  
  
class CatatanService {  
  static async create(data) {  
    return await Catatan.create(data);  
  }  
  
  static async getAll() {  
    return await Catatan.findAll();  
  }  
  
  static async getById(id) {  
    return await Catatan.findByPk(id);  
  }  
  
  static async update(id, data) {  
    const catatan = await Catatan.findByPk(id);  
    if (!catatan) return null;  
  
    Object.assign(catatan, data);  
    await catatan.save();  
  
    return catatan;  
  }  
  
  static async delete(id) {  
    const catatan = await Catatan.findByPk(id);  
    if (!catatan) return null;  
    await catatan.update({ is_deleted: true });  
    return true;  
  }  
}  
  
module.exports = CatatanService;  
