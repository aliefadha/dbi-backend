const { Op } = require("sequelize");
const { sequelize } = require("../models");
const BarangNonHandmadeGudang = require("../models/barangNonHandmadeGudang");
const JenisBarangGudang = require("../models/jenisBarangGudang");
const PackagingGudang = require("../models/packagingGudang");
const ProdukPenjualanGudang = require("../models/produkPenjualanGudang");
const StokBarangGudang = require("../models/stokBarangGudang");
const BarangHandmadeGudang = require("../models/barangHandmadeGudang");
const BarangMentah = require("../models/barangMentah");

class ProdukPenjualanGudangService {
  static async create(data) {
    const transaction = await sequelize.transaction();

    try {
      // Check stock levels before creating the record  
      const checkStock = async (model, idField, idValue, quantity) => {
        const stockRecord = await model.findOne({
          where: {
            [idField]: idValue,
            is_deleted: false
          },
          transaction
        });

        if (!stockRecord) {
          throw new Error(`Stock record not found for ${idField}: ${idValue}`);
        }

        if (stockRecord.jumlah_stok < quantity) {
          throw new Error(`Insufficient stock for ${idField}: ${idValue}. Available: ${stockRecord.jumlah_stok}, Required: ${quantity}`);
        }
      };

      if (data.packaging_id) {
        await checkStock(StokBarangGudang, 'packaging_id', data.packaging_id, data.kuantitas);
      }

      if (data.barang_mentah_id) {
        await checkStock(StokBarangGudang, 'barang_mentah_id', data.barang_mentah_id, data.kuantitas);
      }

      if (data.barang_id) {
        await checkStock(StokBarangGudang, 'barang_id', data.barang_id, data.kuantitas);
      }

      // Create the new record after stock checks  
      const res = await ProdukPenjualanGudang.create(data, { transaction });

      // Update stock levels  
      const updateStock = async (model, idField, idValue, quantity) => {
        const stockRecord = await model.findOne({
          where: {
            [idField]: idValue,
            is_deleted: false
          },
          transaction
        });

        if (stockRecord) {
          await stockRecord.update(
            { jumlah_stok: stockRecord.jumlah_stok - quantity },
            { transaction }
          );
        } else {
          await model.create(
            {
              [idField]: idValue,
              jumlah_stok: quantity * -1
            },
            { transaction }
          );
        }
      };

      if (res.packaging_id) {
        await updateStock(StokBarangGudang, 'packaging_id', res.packaging_id, res.kuantitas);
      }

      if (res.barang_mentah_id) {
        await updateStock(StokBarangGudang, 'barang_mentah_id', res.barang_mentah_id, res.kuantitas);
      }

      if (res.barang_id) {
        await updateStock(StokBarangGudang, 'barang_id', res.barang_id, res.kuantitas);
      }

      await transaction.commit();
      return res;
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  static async createMany(dataArray, options = {}) {
    const transaction = options.transaction;
    const createdProdukList = [];

    try {
      for (const data of dataArray) {
        const { packaging_id, barang_mentah_id, barang_handmade_id, barang_nonhandmade_id, kuantitas, harga_satuan, total_biaya } = data;

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
        } else {
          continue;
        }

        // Check stock and get stock record
        const stockRecord = await StokBarangGudang.findOne({
          where: {
            [fieldName]: fieldValue,
            is_deleted: false
          },
          transaction
        });

        if (!stockRecord || stockRecord.jumlah_stok <= 0) {
          const availableStock = stockRecord ? stockRecord.jumlah_stok : 0;
          throw new Error(`Stok barang ${fieldName}: ${fieldValue} kosong. Tersedia: ${availableStock}, Kuantitas: ${kuantitas}`);
        }

        if (stockRecord.jumlah_stok < kuantitas) {
          throw new Error(`Stok barang ${fieldName}: ${fieldValue} tidak cukup. Tersedia: ${stockRecord.jumlah_stok}, Kuantitas: ${kuantitas}`);
        }

        // Create product and update stock in sequence
        const createdProduct = await ProdukPenjualanGudang.create(data, {
          transaction,
        });

        // Update stock using the same logic as in create method
        if (stockRecord) {
          await stockRecord.update(
            { jumlah_stok: stockRecord.jumlah_stok - kuantitas },
            { transaction }
          );
        } else {
          await StokBarangGudang.create(
            {
              [fieldName]: fieldValue,
              jumlah_stok: kuantitas * -1
            },
            { transaction }
          );
        }

        createdProdukList.push(createdProduct);
      }

      return createdProdukList;
    } catch (error) {
      throw new Error(`Failed to create products: ${error.message}`);
    }
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

  static async updateMany(data, options = {}) {
    const transaction = options.transaction;

    try {
      // Get all existing products for this penjualan_id
      const existingProducts = await ProdukPenjualanGudang.findAll({
        where: {
          penjualan_id: data.penjualan_id,
          is_deleted: false
        },
        transaction
      });

      // Create a map of new products for easy lookup
      const newProductIds = new Set(data.produk.map(p => {
        if (p.packaging_id) return `packaging_${p.packaging_id}`;
        if (p.barang_mentah_id) return `mentah_${p.barang_mentah_id}`;
        if (p.barang_nonhandmade_id) return `nonhandmade_${p.barang_nonhandmade_id}`;
        if (p.barang_handmade_id) return `handmade_${p.barang_handmade_id}`;
      }));

      // Return stock for products that will be removed
      for (const product of existingProducts) {
        const { packaging_id, barang_mentah_id, barang_nonhandmade_id, barang_handmade_id, kuantitas } = product;
        let productIdentifier;

        if (packaging_id) productIdentifier = `packaging_${packaging_id}`;
        else if (barang_mentah_id) productIdentifier = `mentah_${barang_mentah_id}`;
        else if (barang_nonhandmade_id) productIdentifier = `nonhandmade_${barang_nonhandmade_id}`;
        else if (barang_handmade_id) productIdentifier = `handmade_${barang_handmade_id}`;
        else continue;

        // Only return stock if product is not in new data
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
            await stockEntry.increment('jumlah_stok', {
              by: kuantitas,
              transaction,
            });
          }
        }
      }

      // Delete existing products
      await ProdukPenjualanGudang.destroy({
        where: {
          penjualan_id: data.penjualan_id
        },
        transaction
      });

      // Create new products and update stock
      const createdProdukList = await ProdukPenjualanGudang.bulkCreate(data.produk, {
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
            const stockDiff = existingProduct.kuantitas - kuantitas;
            const newStockAmount = stockEntry.jumlah_stok + stockDiff;

            // Check if we have enough stock
            if (newStockAmount < 0) {
              throw new Error(`Stok barang ${fieldName}: ${fieldValue} tidak cukup. Tersedia: ${stockEntry.jumlah_stok}, Kuantitas: ${kuantitas}`);
            }

            await stockEntry.update(
              { jumlah_stok: newStockAmount },
              { transaction }
            );
          } else {
            // If it's a new product, check if we have enough stock
            if (stockEntry.jumlah_stok < kuantitas) {
              throw new Error(`Stok barang ${fieldName}: ${fieldValue} tidak cukup. Tersedia: ${stockEntry.jumlah_stok}, Kuantitas: ${kuantitas}`);
            }

            await stockEntry.decrement('jumlah_stok', {
              by: kuantitas,
              transaction,
            });
          }
        } else {
          throw new Error(`Stok barang ${fieldName}: ${fieldValue} tidak ditemukan`);
        }
      }

      return createdProdukList;
    } catch (error) {
      throw new Error(`Failed to update products: ${error.message}`);
    }
  }

  static async delete(id) {
    const transaction = await sequelize.transaction();

    try {
      const produkPenjualanGudang = await ProdukPenjualanGudang.findByPk(id);
      if (!produkPenjualanGudang) return null;

      const { packaging_id, barang_mentah_id, barang_handmade_id, barang_nonhandmade_id, kuantitas } = produkPenjualanGudang;

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
        transaction
      });

      if (stockRecord) {
        await stockRecord.increment('jumlah_stok', {
          by: kuantitas,
          transaction,
        });
      }

      await produkPenjualanGudang.update({ is_deleted: true }, { transaction });
      await transaction.commit();
      return true;
    } catch (error) {
      await transaction.rollback();
      throw new Error(`Failed to delete product: ${error.message}`);
    }
  }

  static async getAllTerlaris(startDate, endDate) {
    const whereClause = {
      is_deleted: false
    };

    // Add date range filter if dates are provided
    if (startDate && endDate) {
      whereClause.createdAt = {
        [Op.between]: [startDate, endDate]
      };
    }

    const [handmade, nonhandmade, mentah, packaging] = await Promise.all([
      // Get Handmade products
      ProdukPenjualanGudang.findAll({
        attributes: [
          'barang_handmade_id',
          [sequelize.fn('SUM', sequelize.col('kuantitas')), 'total_terjual']
        ],
        where: {
          ...whereClause,
          barang_handmade_id: { [Op.not]: null }
        },
        include: [
          {
            model: BarangHandmadeGudang,
            as: "barang_handmade",
            attributes: ['nama_barang', 'image']
          }
        ],
        group: ['nama_barang'],
        order: [[sequelize.fn('SUM', sequelize.col('kuantitas')), 'DESC']],
        limit: 1
      }),

      // Get Non-Handmade products
      ProdukPenjualanGudang.findAll({
        attributes: [
          'barang_nonhandmade_id',
          [sequelize.fn('SUM', sequelize.col('kuantitas')), 'total_terjual']
        ],
        where: {
          ...whereClause,
          barang_nonhandmade_id: { [Op.not]: null }
        },
        include: [
          {
            model: BarangNonHandmadeGudang,
            as: "barang_nonhandmade",
            attributes: ['nama_barang', 'image']
          }
        ],
        group: ['nama_barang'],
        order: [[sequelize.fn('SUM', sequelize.col('kuantitas')), 'DESC']],
        limit: 1
      }),

      // Get Raw Materials
      ProdukPenjualanGudang.findAll({
        attributes: [
          'barang_mentah_id',
          [sequelize.fn('SUM', sequelize.col('kuantitas')), 'total_terjual']
        ],
        where: {
          ...whereClause,
          barang_mentah_id: { [Op.not]: null }
        },
        include: [
          {
            model: BarangMentah,
            as: "barang_mentah",
            attributes: ['nama_barang', 'image']
          }
        ],
        group: ['nama_barang'],
        order: [[sequelize.fn('SUM', sequelize.col('kuantitas')), 'DESC']],
        limit: 1
      }),

      // Get Packaging
      ProdukPenjualanGudang.findAll({
        attributes: [
          'packaging_id',
          [sequelize.fn('SUM', sequelize.col('kuantitas')), 'total_terjual']
        ],
        where: {
          ...whereClause,
          packaging_id: { [Op.not]: null }
        },
        include: [
          {
            model: PackagingGudang,
            as: "packaging",
            attributes: ['nama_packaging', 'image']
          }
        ],
        group: ['nama_packaging'],
        order: [[sequelize.fn('SUM', sequelize.col('kuantitas')), 'DESC']],
        limit: 1
      })
    ]);

    // Format the results
    return {
      handmade: handmade[0] ? {
        id: handmade[0].barang_handmade_id,
        image: handmade[0].barang_handmade.image,
        nama: handmade[0].barang_handmade.nama_barang,
        total_terjual: parseInt(handmade[0].dataValues.total_terjual),
        kategori: 'Handmade'
      } : null,
      nonhandmade: nonhandmade[0] ? {
        id: nonhandmade[0].barang_nonhandmade_id,
        image: nonhandmade[0].barang_nonhandmade.image,
        nama: nonhandmade[0].barang_nonhandmade.nama_barang,
        total_terjual: parseInt(nonhandmade[0].dataValues.total_terjual),
        kategori: 'Non-Handmade'
      } : null,
      mentah: mentah[0] ? {
        id: mentah[0].barang_mentah_id,
        image: mentah[0].barang_mentah.image,
        nama: mentah[0].barang_mentah.nama_barang,
        total_terjual: parseInt(mentah[0].dataValues.total_terjual),
        kategori: 'Bahan Mentah'
      } : null,
      packaging: packaging[0] ? {
        id: packaging[0].packaging_id,
        image: packaging[0].packaging.image,
        nama: packaging[0].packaging.nama_packaging,
        total_terjual: parseInt(packaging[0].dataValues.total_terjual),
        kategori: 'Packaging'
      } : null
    };
  }

  static async getTopTenTerlaris(startDate, endDate) {
    const whereClause = {
      is_deleted: false
    };

    // Add date range filter if dates are provided
    if (startDate && endDate) {
      whereClause.createdAt = {
        [Op.between]: [startDate, endDate]
      };
    }

    const [handmade, nonhandmade, mentah, packaging] = await Promise.all([
      // Get Handmade products
      ProdukPenjualanGudang.findAll({
        attributes: [
          'barang_handmade_id',
          [sequelize.fn('SUM', sequelize.col('kuantitas')), 'total_terjual']
        ],
        where: {
          ...whereClause,
          barang_handmade_id: { [Op.not]: null }
        },
        include: [{
          model: BarangHandmadeGudang,
          as: "barang_handmade",
          attributes: ['nama_barang', 'image']
        }],
        group: ['nama_barang']
      }),

      // Get Non-Handmade products
      ProdukPenjualanGudang.findAll({
        attributes: [
          'barang_nonhandmade_id',
          [sequelize.fn('SUM', sequelize.col('kuantitas')), 'total_terjual']
        ],
        where: {
          ...whereClause,
          barang_nonhandmade_id: { [Op.not]: null }
        },
        include: [{
          model: BarangNonHandmadeGudang,
          as: "barang_nonhandmade",
          attributes: ['nama_barang', 'image']
        }],
        group: ['nama_barang']
      }),

      // Get Raw Materials
      ProdukPenjualanGudang.findAll({
        attributes: [
          'barang_mentah_id',
          [sequelize.fn('SUM', sequelize.col('kuantitas')), 'total_terjual']
        ],
        where: {
          ...whereClause,
          barang_mentah_id: { [Op.not]: null }
        },
        include: [{
          model: BarangMentah,
          as: "barang_mentah",
          attributes: ['nama_barang', 'image']
        }],
        group: ['nama_barang']
      }),

      // Get Packaging
      ProdukPenjualanGudang.findAll({
        attributes: [
          'packaging_id',
          [sequelize.fn('SUM', sequelize.col('kuantitas')), 'total_terjual']
        ],
        where: {
          ...whereClause,
          packaging_id: { [Op.not]: null }
        },
        include: [{
          model: PackagingGudang,
          as: "packaging",
          attributes: ['nama_packaging', 'image']
        }],
        group: ['nama_packaging']
      })
    ]);

    // Combine all products into a single array
    const allProducts = [
      ...handmade.map(item => ({
        id: item.barang_handmade_id,
        image: item.barang_handmade.image,
        nama: item.barang_handmade.nama_barang,
        total_terjual: parseInt(item.dataValues.total_terjual),
        kategori: 'Handmade'
      })),
      ...nonhandmade.map(item => ({
        id: item.barang_nonhandmade_id,
        image: item.barang_nonhandmade.image,
        nama: item.barang_nonhandmade.nama_barang,
        total_terjual: parseInt(item.dataValues.total_terjual),
        kategori: 'Non-Handmade'
      })),
      ...mentah.map(item => ({
        id: item.barang_mentah_id,
        image: item.barang_mentah.image,
        nama: item.barang_mentah.nama_barang,
        total_terjual: parseInt(item.dataValues.total_terjual),
        kategori: 'Bahan Mentah'
      })),
      ...packaging.map(item => ({
        id: item.packaging_id,
        image: item.packaging.image,
        nama: item.packaging.nama_packaging,
        total_terjual: parseInt(item.dataValues.total_terjual),
        kategori: 'Packaging'
      }))
    ];

    return allProducts
      .sort((a, b) => b.total_terjual - a.total_terjual)
      .slice(0, 10);
  }

  static async getAllByPenjualanId(penjualanId) {
    const products = await ProdukPenjualanGudang.findAll({
      where: {
        penjualan_id: penjualanId,
        is_deleted: false
      },
      attributes: {
        exclude: ["is_deleted", "barang_mentah_id", "barang_nonhandmade_id", "barang_handmade_id", "packaging_id", "produk_penjualan_id", "penjualan_id", "createdAt", "updatedAt"]
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

module.exports = ProdukPenjualanGudangService;
