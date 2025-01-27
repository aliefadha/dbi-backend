const BarangMentah = require("../models/barangMentah");
const BarangNonHandmadeGudang = require("../models/barangNonHandmadeGudang");
const JenisBarangGudang = require("../models/jenisBarangGudang");
const KategoriBarangGudang = require("../models/kategoriBarangGudang");
const PackagingGudang = require("../models/packagingGudang");
const ProdukPembelianGudang = require("../models/produkPembelianGudang");  
const StokBarangGudang = require("../models/stokBarangGudang");
  
class ProdukPembelianGudangService {  
  static async create(data) {  
    return await ProdukPembelianGudang.create(data);
  }  
  
  static async createMany(dataArray, options = {}) {
    const transaction = options.transaction;
  
    try {
      const createdProdukList = await ProdukPembelianGudang.bulkCreate(dataArray, {
        transaction,
        returning: true,
      });
  
      for (const produk of createdProdukList) {
        const { packaging_id, barang_mentah_id, barang_nonhandmade_id, barang_handmade_id, kuantitas } = produk;
  
        let fieldName, fieldValue;
        if (packaging_id) {
          fieldName = 'packaging_id';
          fieldValue = packaging_id;
        } else if (barang_mentah_id) {
          fieldName = 'barang_mentah_id';
          fieldValue = barang_mentah_id;
        } else if (barang_nonhandmade_id) {
          fieldName = 'barang_nonhandmade_id';
          fieldValue = barang_nonhandmade_id;
        } else if (barang_handmade_id) {
          fieldName = 'barang_handmade_id';
          fieldValue = barang_handmade_id;
        }
         else {
          continue;
        }
  
        let stokEntry = await StokBarangGudang.findOne({
          where: {
            [fieldName]: fieldValue,
            is_deleted: false,
          },
          transaction,
        });
  
        if (stokEntry) {
          await stokEntry.increment('jumlah_stok', {
            by: kuantitas,
            transaction,
          });
        } else {
          await StokBarangGudang.create(
            {
              [fieldName]: fieldValue,
              jumlah_stok: kuantitas,
            },
            { transaction }
          );
        }
      }
  
      return createdProdukList;
    } catch (error) {
      throw new Error(`createMany failed: ${error.message}`);
    }
  }

  static async getAll() {  
    return await ProdukPembelianGudang.findAll({
      where: {
        is_deleted: false
      }
    });  
  }  
  
  static async getById(id) {  
    return await ProdukPembelianGudang.findOne({
      where: {
        produk_pembelian_id: id,
        is_deleted: false
      },
      include: [
        {
          model: BarangNonHandmadeGudang,
          as: "barang_nonhandmade",
          attributes: ["image", "nama_barang", "kategori_barang_id", "jenis_barang_id", "harga_jual", "is_deleted"],
          include: [
            {
              model: KategoriBarangGudang,
              as: "kategori",
              attributes: ["nama_kategori_barang", "is_deleted"]
            },
            {
              model: JenisBarangGudang,
              as: "jenis",
              attributes: ["nama_jenis_barang", "is_deleted"]
            }
          ]
        },
        {
          model: BarangMentah,
          as: "barang_mentah",
          attributes: ["image", "nama_barang", "harga_satuan", "is_deleted"],
        },
        {
          model: PackagingGudang,
          as: "packaging",
          attributes: ["image", "nama_packaging", "ukuran", "harga_satuan"]
        },
      ]
    });  
  }  
  
  static async update(id, data) {  
    const produkPembelianGudang = await ProdukPembelianGudang.findByPk(id);  
    if (!produkPembelianGudang) return null;  
  
    Object.assign(produkPembelianGudang, data);  
    await produkPembelianGudang.save();  
  
    return produkPembelianGudang;  
  }  
  
  static async delete(id) {  
    const produkPembelianGudang = await ProdukPembelianGudang.findByPk(id);  
    if (!produkPembelianGudang) return null;  
    await produkPembelianGudang.update({ is_deleted: true });  
    return true;  
  }  
}  
  
module.exports = ProdukPembelianGudangService;  
