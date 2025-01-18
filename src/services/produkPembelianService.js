const Barang = require("../models/barang");
const Cabang = require("../models/cabang");
const ProdukPembelian = require("../models/produkPembelian");  
  
class ProdukPembelianService {  
  static async create(data) {  
    return await ProdukPembelian.create(data);  
  }  
  
  static async getAll() {  
    return await ProdukPembelian.findAll({
      include: [
        {
          model: Cabang,
          as: "cabang",
          attributes: ["cabang_id", "nama_cabang"]
        },
        {
          model: Barang,
          as: "barang",
          attributes: ["nama_barang", "harga_jual"]
        },
      ]
    });  
  }  
  
  static async getById(id) {  
    return await ProdukPembelian.findByPk(id, {
      include: [
        {
          model: Cabang,
          as: "cabang",
          attributes: ["cabang_id", "nama_cabang"]
        },
        {
          model: Barang,
          as: "barang",
          attributes: ["nama_barang", "harga_jual"]
        }
      ],
      attributes: ["cabang_id", "barang_id", "total_biaya", "kuantitas"] 
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
    await produkPembelian.destroy();  
    return true;  
  }  
}  
//TODO: next is this
  
module.exports = ProdukPembelianService;  
