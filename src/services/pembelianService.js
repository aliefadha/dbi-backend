const { sequelize } = require("../models");
const BarangCustom = require("../models/barangCustom");
const MetodePembayaran = require("../models/metodePembayaran");
const Pembelian = require("../models/pembelian");  
const ProdukPembelianService = require("./produkPembelianService");
const ProdukPembelian = require("../models/produkPembelian");
const BarangNonHandmade = require("../models/barangNonHandmade");
const KategoriBarang = require("../models/kategoriBarang");
const BarangHandmade = require("../models/barangHandmade");
const JenisBarang = require("../models/jenisBarang");
const Packaging = require("../models/packaging");
  
class PembelianService {  
  static async create(data) {  
    const transaction = await sequelize.transaction();  
    try {  
      const pembelian = await Pembelian.create(data, { transaction });  
      const produkPembelian = data.produk.map(item => ({
        ...item,
        pembelian_id: pembelian.pembelian_id
      }));

      await ProdukPembelianService.createMany(produkPembelian, { transaction });

      await transaction.commit();  
      return pembelian;  
    } catch (error) {  
      await transaction.rollback();  
      throw error;  
    }  
  }  
  
  static async getAll() {  
    return await Pembelian.findAll({
      where: {
        is_deleted: false
      },include: [
        {
          model: ProdukPembelian,
          as: "produk_pembelian",
          include: [
            {
              model: BarangHandmade,
              as: "barang_handmade",
              attributes: ['nama_barang']
            },
            {
              model: BarangNonHandmade,
              as: "barang_non_handmade",
              attributes: ['nama_barang']
            },
            {
              model: Packaging,
              as: "packaging",
              attributes: ["image", "nama_packaging", "ukuran", "harga_satuan"],
              attributes: ['nama_packaging']
            },
            {
              model: BarangCustom,
              as: "barang_custom",
              attributes: ['nama_barang']
            }
          ]
        }
      ]
    });  
  }  
  
  static async getById(id) {  
    return await Pembelian.findOne({
      where: {
        pembelian_id: id,
        is_deleted: false
      },include: [
        {
          model: MetodePembayaran,
          as: "metode_pembayaran",
          attributes: ["metode_id", "nama_metode"]
        },
        {
          model: ProdukPembelian,
          as: "produk_pembelian",
          include: [
            {
              model: BarangHandmade,
              as: "barang_handmade",
              include: [
                {
                  model: JenisBarang,
                  as: "jenis_barang",
                  attributes: ["nama_jenis_barang"]
                },
                {
                  model: KategoriBarang,
                  as: "kategori_barang",
                  attributes: ["nama_kategori_barang"]
                }
              ]
            },
            {
              model: BarangNonHandmade,
              as: "barang_non_handmade",
              include: [
                {
                  model: KategoriBarang,
                  as: "kategori",
                  attributes: ["nama_kategori_barang"]
                },
                {
                  model: JenisBarang,
                  as: "jenis",
                  attributes: ["nama_jenis_barang"]
                }
              ]
            },
            {
              model: Packaging,
              as: "packaging",
              attributes: ["image", "nama_packaging", "ukuran", "harga_satuan"],
              include: [
                {
                  model: JenisBarang,
                  as: "jenis_barang",
                  attributes: ["nama_jenis_barang"]
                },
                {
                  model: KategoriBarang,
                  as: "kategori_barang",
                  attributes: ["nama_kategori_barang"]
                }
              ]
            },
            {
              model: BarangCustom,
              as: "barang_custom",
              include: [
                {
                  model: JenisBarang,
                  as: "jenis_barang",
                  attributes: ["nama_jenis_barang"]
                },
                {
                  model: KategoriBarang,
                  as: "kategori",
                  attributes: ["nama_kategori_barang"]
                }
              ]
            }
          ]
        }
      ]
    });  
  }  
  
  static async update(id, data) {  
    const transaction = await sequelize.transaction();  
    try {  
      const pembelian = await Pembelian.findOne({
        where: {
          pembelian_id: id,
          is_deleted: false
        }
      });  
      if (!pembelian) return null;  
      await pembelian.update(data, { transaction });  

      if (data.produk && Array.isArray(data.produk)) {  
        // Update or create new produk  
        const produkData = data.produk.map(item => (  
          {  
            ...item,  
            pembelian_id: id  
          }  
        ));  
        await ProdukPembelianService.updateMany(produkData, { transaction });  
      }
      await transaction.commit();  

      const updatedPembelian = await this.getById(id);
      return updatedPembelian;  
    } catch (error) {  
      await transaction.rollback();  
      throw error;  
    }
  }  
  
  static async delete(id) {  
    const pembelian = await Pembelian.findByPk(id);  
    if (!pembelian) return null;  
    await pembelian.update({ is_deleted: true });  
    return true;  
  }  
}  
  
module.exports = PembelianService;  
