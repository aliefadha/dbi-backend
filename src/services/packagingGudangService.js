const PackagingGudang = require("../models/packagingGudang");  
  
class PackagingGudangService {  
  static async create(data) {  
    return await PackagingGudang.create(data);  
  }  
  
  static async getAll() {  
    return await PackagingGudang.findAll({
      where: {
        is_deleted: false
      }
    });  
  }  
  
  static async getById(id) {  
    return await PackagingGudang.findOne({
      where: {
        packaging_id: id,
        is_deleted: false
      }
    });  
  }  
  
  static async update(id, data) {  
    const packagingGudang = await PackagingGudang.findByPk(id);  
    if (!packagingGudang) return null;  
  
    Object.assign(packagingGudang, data);  
    await packagingGudang.save();  
  
    return packagingGudang;  
  }  
  
  static async delete(id) {  
    const packagingGudang = await PackagingGudang.findByPk(id);  
    if (!packagingGudang) return null;  
    await packagingGudang.update({ is_deleted: true });  
    return true;  
  }  
}  
  
module.exports = PackagingGudangService;  
