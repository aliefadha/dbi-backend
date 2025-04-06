const BarangHandmadeGudang = require("../models/barangHandmadeGudang");
const BarangMentah = require("../models/barangMentah");
const BarangNonHandmadeGudang = require("../models/barangNonHandmadeGudang");
const JenisBarangGudang = require("../models/jenisBarangGudang");
const KategoriBarangGudang = require("../models/kategoriBarangGudang");
const PackagingGudang = require("../models/packagingGudang");
const ProdukPembelianGudang = require("../models/produkPembelianGudang");
const StokBarangGudang = require("../models/stokBarangGudang");
const { sequelize } = require("../models");

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

  static async updateMany(dataArray, options = {}) {
    const transaction = options.transaction;

    try {
      // Get all existing products for this pembelian_id
      const existingProducts = await ProdukPembelianGudang.findAll({
        where: {
          pembelian_id: dataArray[0].pembelian_id,
          is_deleted: false
        },
        transaction
      });

      // Check which products are not in the new data array and remove their stock
      const newProductIds = new Set(dataArray.map(p => {
        if (p.packaging_id) return `packaging_${p.packaging_id}`;
        if (p.barang_mentah_id) return `mentah_${p.barang_mentah_id}`;
        if (p.barang_nonhandmade_id) return `nonhandmade_${p.barang_nonhandmade_id}`;
        if (p.barang_handmade_id) return `handmade_${p.barang_handmade_id}`;
      }));

      // Decrease stock for products that will be removed
      for (const product of existingProducts) {
        const { packaging_id, barang_mentah_id, barang_nonhandmade_id, barang_handmade_id, kuantitas } = product;
        let productIdentifier;

        if (packaging_id) productIdentifier = `packaging_${packaging_id}`;
        else if (barang_mentah_id) productIdentifier = `mentah_${barang_mentah_id}`;
        else if (barang_nonhandmade_id) productIdentifier = `nonhandmade_${barang_nonhandmade_id}`;
        else if (barang_handmade_id) productIdentifier = `handmade_${barang_handmade_id}`;
        else continue;

        // Only decrease stock if product is not in new data
        if (!newProductIds.has(productIdentifier)) {
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

          let stockEntry = await StokBarangGudang.findOne({
            where: {
              [fieldName]: fieldValue,
              is_deleted: false,
            },
            transaction,
          });

          if (stockEntry) {
            await stockEntry.decrement('jumlah_stok', {
              by: kuantitas,
              transaction,
            });
          }
        }
      }

      // Delete existing products
      await ProdukPembelianGudang.destroy({
        where: {
          pembelian_id: dataArray[0].pembelian_id
        },
        transaction
      });

      // Create new products and update stock
      const createdProdukList = await ProdukPembelianGudang.bulkCreate(dataArray, {
        transaction,
        returning: true,
      });

      // Update stock for new products
      for (const produk of createdProdukList) {
        const { packaging_id, barang_mentah_id, barang_nonhandmade_id, barang_handmade_id, kuantitas } = produk;

        // Find existing product to compare quantities
        const existingProduct = existingProducts.find(ep => {
          if (packaging_id && ep.packaging_id === packaging_id) return true;
          if (barang_mentah_id && ep.barang_mentah_id === barang_mentah_id) return true;
          if (barang_nonhandmade_id && ep.barang_nonhandmade_id === barang_nonhandmade_id) return true;
          if (barang_handmade_id && ep.barang_handmade_id === barang_handmade_id) return true;
          return false;
        });

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
        } else {
          continue;
        }

        let stockEntry = await StokBarangGudang.findOne({
          where: {
            [fieldName]: fieldValue,
            is_deleted: false,
          },
          transaction,
        });

        if (stockEntry) {
          if (existingProduct) {
            // If product existed before, calculate the difference
            const stockDiff = kuantitas - existingProduct.kuantitas;
            await stockEntry.increment('jumlah_stok', {
              by: stockDiff,
              transaction,
            });

            // Check if stock is 0 after update
            await stockEntry.reload();
            if (stockEntry.jumlah_stok <= 0) {
              await stockEntry.destroy({ transaction });
            }
          } else {
            // If it's a new product, just add the quantity
            await stockEntry.increment('jumlah_stok', {
              by: kuantitas,
              transaction,
            });
          }
        } else {
          // Only create new stock if quantity is greater than 0
          if (kuantitas > 0) {
            await StokBarangGudang.create(
              {
                [fieldName]: fieldValue,
                jumlah_stok: kuantitas,
              },
              { transaction }
            );
          }
        }
      }

      return createdProdukList;
    } catch (error) {
      throw new Error(`updateMany failed: ${error.message}`);
    }
  }


  static async delete(id) {
    const transaction = await sequelize.transaction();

    try {
      const produkPembelianGudangs = await ProdukPembelianGudang.findAll({
        where: { pembelian_id: id }
      });
      if (!produkPembelianGudangs) return null;
      for (const produkPembelianGudang of produkPembelianGudangs) {
        const { packaging_id, barang_mentah_id, barang_handmade_id, barang_nonhandmade_id, kuantitas } = produkPembelianGudang;

        let fieldName, fieldValue;
        if (packaging_id) {
          fieldName = 'packaging_id';
          fieldValue = packaging_id;
        } else if (barang_mentah_id) {
          fieldName = 'barang_mentah_id';
          fieldValue = barang_mentah_id;
        } else if (barang_handmade_id) {
          fieldName = 'barang_handmade_id';
          fieldValue = barang_handmade_id;
        } else if (barang_nonhandmade_id) {
          fieldName = 'barang_nonhandmade_id';
          fieldValue = barang_nonhandmade_id;
        }

        // Return stock
        const stockRecord = await StokBarangGudang.findOne({
          where: {
            [fieldName]: fieldValue,
            is_deleted: false
          },
          transaction,
        });

        if (stockRecord) {
          await stockRecord.decrement('jumlah_stok', {
            by: kuantitas,
            transaction,
          });
        }

        await produkPembelianGudang.destroy({ transaction });
      }
      await transaction.commit();

      return true;
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  static async getAllByPembelianId(pembelianId) {
    const products = await ProdukPembelianGudang.findAll({
      where: {
        pembelian_id: pembelianId,
        is_deleted: false
      },
      attributes: {
        exclude: ["is_deleted", "barang_mentah_id", "barang_nonhandmade_id", "barang_handmade_id", "packaging_id", "produk_pembelian_id", "pembelian_id"]
      },
      include: [
        {
          model: BarangNonHandmadeGudang,
          as: "barang_nonhandmade",
          attributes: ["image", "barang_nonhandmade_id", "nama_barang", "jenis_barang_id", "harga_jual", "is_deleted"],
        },
        {
          model: BarangHandmadeGudang,
          as: "barang_handmade",
          attributes: ["image", "barang_handmade_id", "nama_barang", "jenis_barang_id", "harga_jual", "is_deleted"],
        },
        {
          model: BarangMentah,
          as: "barang_mentah",
          attributes: ["image", "barang_mentah_id", "nama_barang", "harga_satuan", "is_deleted"],
        },
        {
          model: PackagingGudang,
          as: "packaging",
          attributes: ["image", "packaging_id", "nama_packaging", "ukuran", "harga_satuan"]
        },
      ]
    });

    // Map the products to include single jenis and barang_id fields
    return products.map(product => {
      const plainProduct = product.get({ plain: true });
      
      if (plainProduct.barang_nonhandmade) {
        plainProduct.jenis = "Barang Non handmade"
        plainProduct.barang_id = plainProduct.barang_nonhandmade.barang_nonhandmade_id;
        plainProduct.image = plainProduct.barang_nonhandmade.image;
        plainProduct.nama_barang = plainProduct.barang_nonhandmade.nama_barang;
        plainProduct.harga_satuan = plainProduct.barang_nonhandmade.harga_jual;
        delete plainProduct.barang_nonhandmade;
      } else if (plainProduct.barang_handmade) {
        plainProduct.jenis = "Barang Handmade"
        plainProduct.barang_id = plainProduct.barang_handmade.barang_handmade_id;
        plainProduct.image = plainProduct.barang_handmade.image;
        plainProduct.nama_barang = plainProduct.barang_handmade.nama_barang;
        plainProduct.harga_satuan = plainProduct.barang_handmade.harga_jual;
        delete plainProduct.barang_handmade;
      } else if (plainProduct.barang_mentah) {
        plainProduct.jenis = "Barang Mentah";
        plainProduct.barang_id = plainProduct.barang_mentah.barang_mentah_id;
        plainProduct.image = plainProduct.barang_mentah.image;
        plainProduct.nama_barang = plainProduct.barang_mentah.nama_barang;
        plainProduct.harga_satuan = plainProduct.barang_mentah.harga_satuan;
        delete plainProduct.barang_mentah;
      } else if (plainProduct.packaging) {
        plainProduct.jenis = "Packaging";
        plainProduct.barang_id = plainProduct.packaging.packaging_id;
        plainProduct.image = plainProduct.packaging.image;
        plainProduct.nama_barang = plainProduct.packaging.nama_packaging;
        plainProduct.harga_satuan = plainProduct.packaging.harga_satuan;  
        delete plainProduct.packaging;
      } else {
        plainProduct.jenis = null;
        plainProduct.barang_id = null;
        plainProduct.barang = null;
      }

      // Clean up remaining ID fields
      delete plainProduct.barang_nonhandmade;
      delete plainProduct.barang_handmade;
      delete plainProduct.barang_mentah;
      delete plainProduct.packaging;

      return plainProduct;
    });
  }
}

module.exports = ProdukPembelianGudangService;
