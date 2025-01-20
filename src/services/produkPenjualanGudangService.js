const BarangNonHandmadeGudang = require("../models/barangNonHandmadeGudang");
const JenisBarangGudang = require("../models/jenisBarangGudang");
const PackagingGudang = require("../models/packagingGudang");
const ProdukPenjualanGudang = require("../models/produkPenjualanGudang");  
const StokBarangGudang = require("../models/stokBarangGudang");
  
class ProdukPenjualanGudangService {  
  static async create(data) {  
    const res =  await ProdukPenjualanGudang.create(data);
    if(res.packaging_id){
      let packaging = await StokBarangGudang.findOne({
        where: {
          packaging_id: res.packaging_id,
          is_deleted: false
        }
      })
      if(packaging){
        await packaging.update({jumlah_stok: packaging.jumlah_stok - res.kuantitas})
        await packaging.save()
      } else {
        await StokBarangGudang.create({packaging_id: res.packaging_id, jumlah_stok: res.kuantitas * -1})
      }
    }

    if(res.barang_mentah_id){
      let barang_mentah = await StokBarangGudang.findOne({
        where: {
          barang_mentah_id: res.barang_mentah_id,
          is_deleted: false
        }
      })
      if(barang_mentah){
        await barang_mentah.update({jumlah_stok: barang_mentah.jumlah_stok - res.kuantitas})
        await barang_mentah.save()
      } else {
        await StokBarangGudang.create({barang_mentah_id: res.barang_mentah_id, jumlah_stok: res.kuantitas * -1})
      }
    }

    if(res.barang_id){
      let barang = await StokBarangGudang.findOne({
        where: {
          barang_id: res.barang_id,
          is_deleted: false
        }
      })

      if(barang){
        await barang.update({jumlah_stok: barang.jumlah_stok - res.kuantitas})
        await barang.save()
      } else {
        await StokBarangGudang.create({barang_id: res.barang_id, jumlah_stok: res.kuantitas * -1})
      }
    }

    return data
  }  
  
  static async getAll() {  
    return await ProdukPenjualanGudang.findAll({
      where: {
        is_deleted: false
      }
    });  
  }  
  
  static async getById(id) {  
    return await ProdukPenjualanGudang.findOne({
      where: {
        produk_penjualan_id: id,
        is_deleted: false
      },
      include: [
        {
          model: BarangNonHandmadeGudang,
          as: "barang_nonhandmade",
          attributes: ["image", "nama_barang", "kategori_barang_id", "jenis_barang_id", "harga_jual", "is_deleted"],
          include: [
            {
              model: JenisBarangGudang,
              as: "jenis",
              attributes: ["nama_jenis_barang", "is_deleted"]
            }
          ]
        },
        {
          model: PackagingGudang,
          as: "packaging",
          attributes: ["image", "nama_packaging", "ukuran", "harga_satuan"]
        }
      ]
    });  
  }  
  
  static async update(id, data) {  
    const produkPenjualanGudang = await ProdukPenjualanGudang.findByPk(id);  
    if (!produkPenjualanGudang) return null;  
  
    Object.assign(produkPenjualanGudang, data);  
    await produkPenjualanGudang.save();  
  
    return produkPenjualanGudang;  
  }  
  
  static async delete(id) {  
    const produkPenjualanGudang = await ProdukPenjualanGudang.findByPk(id);  
    if (!produkPenjualanGudang) return null;  
    await produkPenjualanGudang.update({ is_deleted: true });  
    return true;  
  }  
}  
  
module.exports = ProdukPenjualanGudangService;  
