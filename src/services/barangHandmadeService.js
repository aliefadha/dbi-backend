const BarangHandmade = require("../models/barangHandmade");  
  
class BarangHandmadeService {  
  static async create(data) {  
    return await BarangHandmade.create(data);  
  }  
  
  static async getAll() {  
    return await BarangHandmade.findAll();  
  }  
  
  static async getById(id) {  
    return await BarangHandmade.findByPk(id);  
  }  
  
  static async update(id, data) {  
    const barangHandmade = await BarangHandmade.findByPk(id);  
    if (!barangHandmade) return null;  
  
    Object.assign(barangHandmade, data);  
    await barangHandmade.save();  
  
    return barangHandmade;  
  }  
  
  static async delete(id) {  
    const barangHandmade = await BarangHandmade.findByPk(id);  
    if (!barangHandmade) return null;  
    await barangHandmade.destroy();  
    return true;  
  }  
}  
  
module.exports = BarangHandmadeService;  
