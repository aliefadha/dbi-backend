const BarangCustom = require("../models/barangCustom");  
  
class BarangCustomService {  
  static async create(data) {  
    return await BarangCustom.create(data);  
  }  
  
  static async getAll() {  
    return await BarangCustom.findAll();  
  }  
  
  static async getById(id) {  
    return await BarangCustom.findByPk(id);  
  }  
  
  static async update(id, data) {  
    const barangCustom = await BarangCustom.findByPk(id);  
    if (!barangCustom) return null;  
  
    Object.assign(barangCustom, data);  
    await barangCustom.save();  
  
    return barangCustom;  
  }  
  
  static async delete(id) {  
    const barangCustom = await BarangCustom.findByPk(id);  
    if (!barangCustom) return null;  
    await barangCustom.destroy();  
    return true;  
  }  
}  
  
module.exports = BarangCustomService;  
