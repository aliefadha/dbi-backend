const Cabang = require("../models/cabang");  
  
class CabangService {  
  static async create(data) {  
    return await Cabang.create(data);  
  }  
  
  static async getAll() {  
    return await Cabang.findAll();  
  }  
  
  static async getById(id) {  
    return await Cabang.findByPk(id);  
  }  
  
  static async update(id, data) {  
    const cabang = await Cabang.findByPk(id);  
    if (!cabang) return null;  
  
    Object.assign(cabang, data);  
    await cabang.save();  
  
    return cabang;  
  }  
  
  static async delete(id) {  
    const cabang = await Cabang.findByPk(id);  
    if (!cabang) return null;  
    await cabang.destroy();  
    return true;  
  }  
}  
  
module.exports = CabangService;  
