const BarangMentah = require("../models/barangMentah");
const BarangNonHandmadeGudang = require("../models/barangNonHandmadeGudang");
const JenisBarangGudang = require("../models/jenisBarangGudang");
const KategoriBarangGudang = require("../models/kategoriBarangGudang");
const PackagingGudang = require("../models/packagingGudang");
const ProdukPembelianGudang = require("../models/produkPembelianGudang");  
const StokBarangGudang = require("../models/stokBarangGudang");
  
class ProdukPembelianGudangService {  
  static async create(data) {  
    const res =  await ProdukPembelianGudang.create(data)

    if(res.packaging_id){
      let packaging = await StokBarangGudang.findOne({
        where: {
          packaging_id: res.packaging_id,
          is_deleted: false
        }
      })
      if(packaging){
        await packaging.update({jumlah_stok: packaging.jumlah_stok + res.kuantitas})
        await packaging.save()
      } else {
        await StokBarangGudang.create({packaging_id: res.packaging_id, jumlah_stok: res.kuantitas})
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
        await barang_mentah.update({jumlah_stok: barang_mentah.jumlah_stok + res.kuantitas})
        await barang_mentah.save()
      } else {
        await StokBarangGudang.create({barang_mentah_id: res.barang_mentah_id, jumlah_stok: res.kuantitas})
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
        await barang.update({jumlah_stok: barang.jumlah_stok + res.kuantitas})
        await barang.save()
      } else {
        await StokBarangGudang.create({barang_id: res.barang_id, jumlah_stok: res.kuantitas})
      }
    }

    return res
  }  
  
  static async createMany(dataArray, options = {}) {
    const transaction = options.transaction;
  
    try {
      const createdProdukList = await ProdukPembelianGudang.bulkCreate(dataArray, {
        transaction,
        returning: true,
      });
  
      for (const produk of createdProdukList) {
        const { packaging_id, barang_mentah_id, barang_id, kuantitas } = produk;
  
        let fieldName, fieldValue;
        if (packaging_id) {
          fieldName = 'packaging_id';
          fieldValue = packaging_id;
        } else if (barang_mentah_id) {
          fieldName = 'barang_mentah_id';
          fieldValue = barang_mentah_id;
        } else if (barang_id) {
          fieldName = 'barang_id';
          fieldValue = barang_id;
        } else {
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
