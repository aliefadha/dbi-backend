const ProdukPenjualan = require("../models/produkPenjualan");  
  
class ProdukPenjualanService {  
  static async create(data) {  
    return await ProdukPenjualan.create(data);  
  }  
  
  static async getAll() {  
    return await ProdukPenjualan.findAll();  
  }  
  
  static async getById(id) {  
    return await ProdukPenjualan.findByPk(id);  
  }  
  
  static async update(id, data) {  
    const produkPenjualan = await ProdukPenjualan.findByPk(id);  
    if (!produkPenjualan) return null;  
  
    Object.assign(produkPenjualan, data);  
    await produkPenjualan.save();  
  
    return produkPenjualan;  
  }  
  
  static async delete(id) {  
    const produkPenjualan = await ProdukPenjualan.findByPk(id);  
    if (!produkPenjualan) return null;  
    await produkPenjualan.destroy();  
    return true;  
  }  
}  
  
module.exports = ProdukPenjualanService;  
