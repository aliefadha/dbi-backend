const BarangNonHandmade = require("../models/barangNonHandmade");
const Cabang = require("../models/cabang");
const ProdukPenjualan = require("../models/produkPenjualan");  
  
class ProdukPenjualanService {  
  static async create(data) {  
    return await ProdukPenjualan.create(data);  
  }  
  
  static async getAll() {  
    return await ProdukPenjualan.findAll();  
  }  
  
  static async getById(id) {  
    return await ProdukPenjualan.findByPk(id, {
      include: [
        {
          model: BarangNonHandmade,
          as: "barang",
          attributes: ["barang_id", "nama_barang"]
        },
        {
          model: Cabang,
          as: "cabang",
          attributes: ["cabang_id", "nama_cabang"]
        }
      ]
    });  
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
