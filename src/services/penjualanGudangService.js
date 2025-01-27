const { sequelize } = require("../models");
const BarangHandmadeGudang = require("../models/barangHandmadeGudang");
const BarangMentah = require("../models/barangMentah");
const BarangNonHandmadeGudang = require("../models/barangNonHandmadeGudang");
const JenisBarangGudang = require("../models/jenisBarangGudang");
const KategoriBarangGudang = require("../models/kategoriBarangGudang");
const MetodePembayaranGudang = require("../models/metodePembayaranGudang");
const PackagingGudang = require("../models/packagingGudang");
const PenjualanGudang = require("../models/penjualanGudang");
const ProdukPenjualanGudang = require("../models/produkPenjualanGudang");
const ProdukPenjualanGudangService = require("./produkPenjualanGudangService");

class PenjualanGudangService {
  static async create(data) {
    const transaction = await sequelize.transaction();
    try {
      const {produk, ...penjualanData} = data;
      const penjualan = await PenjualanGudang.create(penjualanData, { transaction });

      if(produk && produk.length > 0) {
        const produkData = produk.map(item => ({
          ...item,
          penjualan_id: penjualan.penjualan_id
        }));

        await ProdukPenjualanGudangService.createMany(produkData, { transaction });
      }
      await transaction.commit();
      return penjualan;
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  static async getAll() {
    const data = await PenjualanGudang.findAll({
      where: {
        is_deleted: false
      },
      attributes: {
        exclude: ["is_deleted", "metode_id"]
      },
      include: [
        {
          model: MetodePembayaranGudang,
          as: "metode_pembayaran",
          attributes: ["nama_metode"]
        },
        {
          model: ProdukPenjualanGudang,
          as: "produk",
          attributes: {
            exclude: ["is_deleted", "barang_mentah_id", "barang_nonhandmade_id", "packaging_id", "barang_handmade_id", "produk_penjualan_id", "penjualan_id"]
          },
          include: [
            {
              model: BarangNonHandmadeGudang,
              as: "barang_nonhandmade",
              attributes: ["image", "nama_barang", "harga_jual", "is_deleted"],
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
              model: BarangHandmadeGudang,
              as: "barang_handmade",
              attributes: ["image", "nama_barang", "kategori_barang_id", "harga_jual", "is_deleted"],
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
        }
      ]
    });

    // Transform the data to include only the relevant product type
    const transformedData = data.map(penjualan => {
      const plainPenjualan = penjualan.get({ plain: true });
      
      if (plainPenjualan.produk) {
        plainPenjualan.produk = plainPenjualan.produk.map(produk => {
          const transformedProduk = { ...produk };
          
          // Keep only the non-null product type
          if (produk.barang_nonhandmade) {
            delete transformedProduk.barang_mentah;
            delete transformedProduk.packaging;
            delete transformedProduk.barang_handmade;
          } else if (produk.barang_mentah) {
            delete transformedProduk.barang_nonhandmade;
            delete transformedProduk.packaging;
            delete transformedProduk.barang_handmade;
          } else if (produk.packaging) {
            delete transformedProduk.barang_nonhandmade;
            delete transformedProduk.barang_mentah;
            delete transformedProduk.barang_handmade;
          } else if (produk.barang_handmade) {
            delete transformedProduk.barang_nonhandmade;
            delete transformedProduk.barang_mentah;
            delete transformedProduk.packaging;
          } 
          else {
            delete transformedProduk.barang_nonhandmade;
            delete transformedProduk.barang_mentah;
            delete transformedProduk.packaging;
          }
          
          return transformedProduk;
        });
      }
      
      return plainPenjualan;
    });

    return transformedData;
  }

  static async getById(id) {
    const data = await PenjualanGudang.findOne({
      where: {
        penjualan_id: id,
        is_deleted: false
      },
      attributes: {
        exclude: ["is_deleted", "metode_id"]
      },
      include: [
        {
          model: MetodePembayaranGudang,
          as: "metode_pembayaran",
          attributes: ["nama_metode"]
        },
        {
          model: ProdukPenjualanGudang,
          as: "produk",
          attributes: {
            exclude: ["is_deleted", "barang_mentah_id", "barang_nonhandmade_id", "packaging_id", "barang_handmade_id", "produk_penjualan_id", "penjualan_id"]
          },
          include: [
            {
              model: BarangNonHandmadeGudang,
              as: "barang_nonhandmade",
              attributes: ["image", "nama_barang", "harga_jual", "is_deleted"],
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
              model: BarangHandmadeGudang,
              as: "barang_handmade",
              attributes: ["image", "nama_barang", "kategori_barang_id", "harga_jual", "is_deleted"],
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
        }
      ]
    });

    if (!data) return null;

    const plainData = data.get({ plain: true });
    
    if (plainData.produk) {
      plainData.produk = plainData.produk.map(produk => {
        const transformedProduk = { ...produk };
        
        if (produk.barang_nonhandmade) {
          delete transformedProduk.barang_mentah;
          delete transformedProduk.packaging;
          delete transformedProduk.barang_handmade;
        } else if (produk.barang_mentah) {
          delete transformedProduk.barang_nonhandmade;
          delete transformedProduk.packaging;
          delete transformedProduk.barang_handmade;
        } else if (produk.packaging) {
          delete transformedProduk.barang_nonhandmade;
          delete transformedProduk.barang_mentah;
          delete transformedProduk.barang_handmade;
        } else if (produk.barang_handmade) {
          delete transformedProduk.barang_nonhandmade;
          delete transformedProduk.barang_mentah;
          delete transformedProduk.packaging;
        } else {
          delete transformedProduk.barang_nonhandmade;
          delete transformedProduk.barang_mentah;
          delete transformedProduk.packaging;
        }
        
        return transformedProduk;
      });
    }

    return plainData;
  }

  static async update(id, data) {
    const transaction = await sequelize.transaction();
    
    try {
      const { produk, ...penjualanData } = data;

      const penjualanGudang = await PenjualanGudang.findOne({
        where: {
          penjualan_id: id,
          is_deleted: false
        }
      });

      if (!penjualanGudang) return null;

      await penjualanGudang.update(penjualanData, { transaction });

      if (produk && Array.isArray(produk)) {
        // Delete existing produk
        await ProdukPenjualanGudang.destroy({
          where: { penjualan_id: id },
          transaction
        });

        // Create new produk
        const produkData = produk.map(item => ({
          ...item,
          penjualan_id: id
        }));

        await ProdukPenjualanGudangService.createMany(produkData, { transaction });
      }

      await transaction.commit();

      const updatedPenjualanGudang = await this.getById(id);
      return updatedPenjualanGudang;
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  static async delete(id) {
    const penjualanGudang = await PenjualanGudang.findByPk(id);
    if (!penjualanGudang) return null;
    await penjualanGudang.update({ is_deleted: true });
    return true;
  }
}

module.exports = PenjualanGudangService;
