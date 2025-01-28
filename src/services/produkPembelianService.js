const ProdukPembelian = require("../models/produkPembelian");  
  
class ProdukPembelianService {  
  static async create(data) {  
    return await ProdukPembelian.create(data);  
  }  
  
  static async getAll() {  
    return await ProdukPembelian.findAll({
      where: {
        is_deleted: false
      }
    });  
  }  
  
  static async getById(id) {  
    return await ProdukPembelian.findOne({
      where: {
        produk_pembelian_id: id,
        is_deleted: false
      }
    });  
  }  
  
  static async update(id, data) {  
    const produkPembelian = await ProdukPembelian.findByPk(id);  
    if (!produkPembelian) return null;  
  
    Object.assign(produkPembelian, data);  
    await produkPembelian.save();  
  
    return produkPembelian;  
  }  
  
  static async delete(id) {  
    const produkPembelian = await ProdukPembelian.findByPk(id);  
    if (!produkPembelian) return null;  
    await produkPembelian.update({ is_deleted: true });  
    return true;  
  }  
}  
  
module.exports = ProdukPembelianService;  
