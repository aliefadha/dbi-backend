const Cabang = require("../models/cabang");  
  
class CabangService {  
  static async create(data) {  
    return await Cabang.create(data);  
  }  
  
  static async getAll(toko_id) {
    const whereConditions = {
        is_deleted: false
    }  

    if (toko_id) {
        whereConditions.toko_id = toko_id
    }
    return await Cabang.findAll({
        where: whereConditions
    });  
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
