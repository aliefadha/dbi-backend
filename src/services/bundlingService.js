const Bundling = require("../models/bundling");  
  
class BundlingService {  
  static async create(data) {  
    return await Bundling.create(data);  
  }  
  
  static async getAll() {  
    return await Bundling.findAll();  
  }  
  
  static async getById(id) {  
    return await Bundling.findByPk(id);  
  }  
  
  static async update(id, data) {  
    const bundling = await Bundling.findByPk(id);  
    if (!bundling) return null;  
  
    Object.assign(bundling, data);  
    await bundling.save();  
  
    return bundling;  
  }  
  
  static async delete(id) {  
    const bundling = await Bundling.findByPk(id);  
    if (!bundling) return null;  
    await bundling.destroy();  
    return true;  
  }  
}  
  
module.exports = BundlingService;  
