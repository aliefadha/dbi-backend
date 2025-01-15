const Pembelian = require("../models/pembelian");  
  
class PembelianService {  
  static async create(data) {  
    return await Pembelian.create(data);  
  }  
  
  static async getAll() {  
    return await Pembelian.findAll();  
  }  
  
  static async getById(id) {  
    return await Pembelian.findByPk(id);  
  }  
  
  static async update(id, data) {  
    const pembelian = await Pembelian.findByPk(id);  
    if (!pembelian) return null;  
  
    Object.assign(pembelian, data);  
    await pembelian.save();  
  
    return pembelian;  
  }  
  
  static async delete(id) {  
    const pembelian = await Pembelian.findByPk(id);  
    if (!pembelian) return null;  
    await pembelian.destroy();  
    return true;  
  }  
}  
  
module.exports = PembelianService;  
