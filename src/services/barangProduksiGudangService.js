const BarangNonHandmadeGudang = require("../models/barangNonHandmadeGudang");
const BarangProduksiGudang = require("../models/barangProduksiGudang");  
const StokBarangGudang = require("../models/stokBarangGudang");
  
class BarangProduksiGudangService {  
  static async create(data) {  
    const res = await BarangProduksiGudang.create(data);
    let barang = await StokBarangGudang.findOne({
      where: {
        barang_id: res.barang_id,
        is_deleted: false
      }
    })

    if(barang){
      await barang.update({jumlah_stok: barang.jumlah_stok + res.jumlah})
      await barang.save()
    } else {
      await StokBarangGudang.create({barang_id: res.barang_id, jumlah_stok: res.jumlah})
    }
    return res
  }  
  
  static async getAll() {  
    return await BarangProduksiGudang.findAll({
      where: {
        is_deleted: false
      },
      include: [
        {
          model: BarangNonHandmadeGudang,
          as: "barang",
          attributes: ["nama_barang"]
        }
      ]
    });  
  }  
  
  static async getById(id) {  
    return await BarangProduksiGudang.findOne({
      where: {
        barang_produksi_gudang_id: id,
        is_deleted: false
      },
      include: [
        {
          model: BarangNonHandmadeGudang,
          as: "barang",
          attributes: ["nama_barang"]
        }
      ]
    });  
  }  
  
  static async update(id, data) {  
    const barangProduksiGudang = await BarangProduksiGudang.findByPk(id);  
    if (!barangProduksiGudang) return null;  
  
    Object.assign(barangProduksiGudang, data);  
    await barangProduksiGudang.save();  
  
    return barangProduksiGudang;  
  }  
  
  static async delete(id) {  
    const barangProduksiGudang = await BarangProduksiGudang.findByPk(id);  
    if (!barangProduksiGudang) return null;  
    await barangProduksiGudang.update({ is_deleted: true });  
    return true;  
  }  
}  
  
module.exports = BarangProduksiGudangService;  
