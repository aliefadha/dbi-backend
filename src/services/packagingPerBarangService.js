const PackagingPerBarang = require("../models/packagingPerBarang");  
  
class PackagingPerBarangService {  
  static async create(data) {  
    return await PackagingPerBarang.create(data);  
  }  
  
  static async getAll() {  
    return await PackagingPerBarang.findAll();  
  }  
  
  static async getById(id) {  
    return await PackagingPerBarang.findByPk(id);  
  }  
  
  static async update(id, data) {  
    const packagingPerBarang = await PackagingPerBarang.findByPk(id);  
    if (!packagingPerBarang) return null;  
  
    Object.assign(packagingPerBarang, data);
    await packagingPerBarang.save();  
  
    return packagingPerBarang;  
  }  
  
  static async delete(id) {  
    const packagingPerBarang = await PackagingPerBarang.findByPk(id);  
    if (!packagingPerBarang) return null;  
    await packagingPerBarang.update({ is_deleted: true });  
    return true;  
  }  
}  
  
module.exports = PackagingPerBarangService;  
