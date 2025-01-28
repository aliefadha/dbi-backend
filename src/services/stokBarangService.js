const StokBarang = require("../models/stokBarang");  
  
class StokBarangService {  
  static async create(data) {  
    return await StokBarang.create(data);  
  }  
  
  static async getAll() {  
    return await StokBarang.findAll({
      where: {
        is_deleted: false
      }
    });  
  }  
  
  static async getById(id) {  
    return await StokBarang.findOne({
      where: {
        stok_barang_id: id,
        is_deleted: false
      }
    });  
  }  
  
  static async update(id, data) {  
    const stokBarang = await StokBarang.findByPk(id);  
    if (!stokBarang) return null;  
  
    Object.assign(stokBarang, data);  
    await stokBarang.save();  
  
    return stokBarang;  
  }  
  
  static async delete(id) {  
    const stokBarang = await StokBarang.findByPk(id);  
    if (!stokBarang) return null;  
    await stokBarang.update({ is_deleted: true });  
    return true;  
  }  
}  
  
module.exports = StokBarangService;  
