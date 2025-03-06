const BarangCustom = require("../models/barangCustom");
const BarangHandmade = require("../models/barangHandmade");
const BarangNonHandmade = require("../models/barangNonHandmade");
const JenisBarang = require("../models/jenisBarang");
const KategoriBarang = require("../models/kategoriBarang");
const Packaging = require("../models/packaging");
const ProdukPenjualan = require("../models/produkPenjualan");
const StokBarang = require("../models/stokBarang");
const { Op } = require("sequelize");
const sequelize = require("../config/database");
const Cabang = require("../models/cabang");
const ProdukPenjualanGudangService = require("./produkPenjualanGudangService");

class ProdukPenjualanService {
  static async create(data) {
    return await ProdukPenjualan.create(data);
  }

  static async createMany(data, options = {}) {
    const transaction = options.transaction;

    try {
      const createdProdukList = await ProdukPenjualan.bulkCreate(data, {
        transaction,
        returning: true,
      });

      for (const produk of createdProdukList) {
        const { cabang_id, packaging_id, barang_custom_id, barang_non_handmade_id, barang_handmade_id, kuantitas } = produk;

        let fieldName, fieldValue;
        if (packaging_id) {
          fieldName = 'packaging_id';
          fieldValue = packaging_id;
        } else if (barang_custom_id) {
          fieldName = 'barang_custom_id';
          fieldValue = barang_custom_id;
        } else if (barang_non_handmade_id) {
          fieldName = 'barang_non_handmade_id';
          fieldValue = barang_non_handmade_id;
        } else if (barang_handmade_id) {
          fieldName = 'barang_handmade_id';
          fieldValue = barang_handmade_id;
        } else {
          continue;
        }

        let stokEntry = await StokBarang.findOne({
          where: {
            cabang_id: cabang_id,
            [fieldName]: fieldValue,
            is_deleted: false
          },
          transaction
        });

        if (!stokEntry || stokEntry.jumlah_stok < kuantitas) {
          const availableStock = stokEntry ? stokEntry.jumlah_stok : 0;
          throw new Error(`Not enough stock for this product: ${fieldValue}. Available: ${availableStock}`);
        }

        // Decrease stock if there is enough
        await stokEntry.decrement('jumlah_stok', { by: kuantitas, transaction });
      }

      return createdProdukList;
    } catch (error) {
      throw new Error(`Produk Penjualan failed: ${error.message}`);
    }
  }

  static async getAll() {
    return await ProdukPenjualan.findAll({
      where: {
        is_deleted: false
      }
    });
  }

  static async getById(id) {
    return await ProdukPenjualan.findOne({
      where: {
        produk_penjualan_id: id,
        is_deleted: false
      }
    });
  }

  static async update(id, data) {
    const produkPenjualan = await ProdukPenjualan.findByPk(id);
    if (!produkPenjualan) return null;

    Object.assign(produkPenjualan, data);
    await produkPenjualan.save();

    return produkPenjualan;
  }

  static async updateMany(data, options = {}) {
    const transaction = options.transaction;

    try {
      const penjualanId = data[0]?.penjualan_id;
      if (!penjualanId) throw new Error("Missing pembelian_id");

      const existingProduks = await ProdukPenjualan.findAll({
        where: { penjualan_id: penjualanId },
        transaction
      });

      const existingProduksMap = new Map(
        existingProduks.map(produk => [produk.produk_penjualan_id, produk])
      );
      const updatedProdukList = new Set();
      const receivedIds = new Set();

      for (const produk of data) {
        const { produk_penjualan_id, cabang_id, kuantitas } = produk;

        const { fieldName, fieldValue } = getFieldAndValue(produk);
        if (!fieldName) continue;

        let difference = 0;

        if (produk_penjualan_id && existingProduksMap.has(produk_penjualan_id)) {
          const existingProduk = existingProduksMap.get(produk_penjualan_id);
          difference = kuantitas - existingProduk.kuantitas;

          await existingProduk.update(produk, { transaction });
          updatedProdukList.add(existingProduk);
          receivedIds.add(produk_penjualan_id);
        } else {
          const newProduk = await ProdukPenjualan.create(produk, { transaction });
          updatedProdukList.add(newProduk.produk_penjualan_id);
          difference = kuantitas;
        }

        // Update stock 
        let stokEntry = await StokBarang.findOne({
          where: {
            cabang_id: cabang_id,
            [fieldName]: fieldValue,
            is_deleted: false
          },
          transaction
        });

        if (stokEntry && stokEntry.jumlah_stok < difference) {
          const availableStock = stokEntry.jumlah_stok ? stokEntry.jumlah_stok : 0;
          throw new Error(`Not enough stock for this product: ${fieldValue}. Available: ${availableStock}`);
        }

        if (stokEntry) {
          await stokEntry.decrement('jumlah_stok', { by: difference, transaction });
        } else {
          await StokBarang.create({
            cabang_id: cabang_id,
            [fieldName]: fieldValue,
            jumlah_stok: kuantitas
          }, { transaction });
        }
      }

      for (const existingProduk of existingProduks) {
        if (!receivedIds.has(existingProduk.produk_penjualan_id)) {
          const { fieldName, fieldValue } = getFieldAndValue(existingProduk);
          if (!fieldName) continue;

          let stokEntry = await StokBarang.findOne({
            where: { [fieldName]: fieldValue, cabang_id: existingProduk.cabang_id, is_deleted: false },
            transaction
          });

          if (stokEntry) {
            await stokEntry.increment('jumlah_stok', { by: existingProduk.kuantitas, transaction });
          }

          await existingProduk.destroy({ transaction });
        }
      }
      return Array.from(updatedProdukList);
    } catch (error) {
      throw new Error(`Update Produk Penjualan failed: ${error.message}`);
    }
  }

  static async delete(id) {
    const existingProduks = await ProdukPenjualan.findAll({
      where: { penjualan_id: id }
    })

    for (const existingProduk of existingProduks) {
      const { fieldName, fieldValue } = getFieldAndValue(existingProduk);
      if (!fieldName) continue;

      let stokEntry = await StokBarang.findOne({
        where: { [fieldName]: fieldValue, cabang_id: existingProduk.cabang_id, is_deleted: false }
      });

      if (stokEntry) {
        await stokEntry.increment('jumlah_stok', { by: existingProduk.kuantitas });
      }

      await existingProduk.destroy();
    }
  }

  static async getAllByPenjualanId(penjualanId) {
    const produk = await ProdukPenjualan.findAll({
      where: {
        penjualan_id: penjualanId,
        is_deleted: false
      },
      attributes: {
        exclude: ["is_deleted", "penjualan_id", "cabang_id", "barang_handmade_id", "barang_non_handmade_id", "packaging_id", "barang_custom_id", "produk_penjualan_id"]
      },
      include: [
        {
          model: BarangHandmade,
          as: "barang_handmade",
          include: [
            {
              model: KategoriBarang,
              as: "kategori_barang",
              attributes: ["nama_kategori_barang"]
            },
            {
              model: JenisBarang,
              as: "jenis_barang",
              attributes: ["nama_jenis_barang"]
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
              as: "jenis_barang"
            },
            {
              model: KategoriBarang,
              as: "kategori"
            }
          ]
        }
      ]
    });
    return produk;
  }

  static async getAllTerlarisByKategoriToko(toko_id, startDate, endDate) {
    const whereClause = {
      is_deleted: false
    };

    if (startDate && endDate) {
      whereClause.createdAt = {
        [Op.between]: [startDate, endDate]
      };
    }
    let includeConditions = [];
    if (toko_id !== null && toko_id !== undefined) {
      includeConditions = [
        {
          model: Cabang,
          as: 'cabang',
          where: { toko_id: toko_id },
          attributes: []
        }
      ];
    }

    const [handmade, nonhandmade, custom, packaging] = await Promise.all([
      // Get Handmade products
      ProdukPenjualan.findAll({
        attributes: [
          'barang_handmade_id',
          [sequelize.fn('SUM', sequelize.col('kuantitas')), 'total_terjual']
        ],
        where: {
          ...whereClause,
          barang_handmade_id: { [Op.not]: null }
        },
        include: [
          ...includeConditions,
          {
            model: BarangHandmade,
            as: "barang_handmade",
            attributes: ['nama_barang', 'image']
          }
        ],
        group: ['nama_barang', 'image'],
        order: [[sequelize.fn('SUM', sequelize.col('kuantitas')), 'DESC']],
        limit: 1
      }),

      // Get Non-Handmade products
      ProdukPenjualan.findAll({
        attributes: [
          'barang_non_handmade_id',
          [sequelize.fn('SUM', sequelize.col('kuantitas')), 'total_terjual']
        ],
        where: {
          ...whereClause,
          barang_non_handmade_id: { [Op.not]: null }
        },
        include: [
          ...includeConditions,
          {
            model: BarangNonHandmade,
            as: "barang_non_handmade",
            attributes: ['nama_barang', 'image']
          }
        ],
        group: ['nama_barang', 'image'],
        order: [[sequelize.fn('SUM', sequelize.col('kuantitas')), 'DESC']],
        limit: 1
      }),

      // Get Custom products
      ProdukPenjualan.findAll({
        attributes: [
          'barang_custom_id',
          [sequelize.fn('SUM', sequelize.col('kuantitas')), 'total_terjual']
        ],
        where: {
          ...whereClause,
          barang_custom_id: { [Op.not]: null }
        },
        include: [
          ...includeConditions,
          {
            model: BarangCustom,
            as: "barang_custom",
            attributes: ['nama_barang', 'image']
          }
        ],
        group: ['nama_barang', 'image'],
        order: [[sequelize.fn('SUM', sequelize.col('kuantitas')), 'DESC']],
        limit: 1
      }),

      // Get Packaging
      ProdukPenjualan.findAll({
        attributes: [
          'packaging_id',
          [sequelize.fn('SUM', sequelize.col('kuantitas')), 'total_terjual']
        ],
        where: {
          ...whereClause,
          packaging_id: { [Op.not]: null }
        },
        include: [
          ...includeConditions,
          {
            model: Packaging,
            as: "packaging",
            attributes: ['nama_packaging', 'image']
          }
        ],
        group: ['nama_packaging', 'image'],
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
        id: nonhandmade[0].barang_non_handmade_id,
        image: nonhandmade[0].barang_non_handmade.image,
        nama: nonhandmade[0].barang_non_handmade.nama_barang,
        total_terjual: parseInt(nonhandmade[0].dataValues.total_terjual),
        kategori: 'Non-Handmade'
      } : null,
      custom: custom[0] ? {
        id: custom[0].barang_custom_id,
        image: custom[0].barang_custom.image,
        nama: custom[0].barang_custom.nama_barang,
        total_terjual: parseInt(custom[0].dataValues.total_terjual),
        kategori: 'Custom'
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

  static async getAllTerlarisByKategoriCabang(cabang_id, startDate, endDate) {
    const whereClause = {
      is_deleted: false,
      cabang_id: cabang_id
    };

    if (startDate && endDate) {
      whereClause.createdAt = {
        [Op.between]: [startDate, endDate]
      };
    }

    const [handmade, nonhandmade, custom, packaging] = await Promise.all([
      // Get Handmade products
      ProdukPenjualan.findAll({
        attributes: [
          'barang_handmade_id',
          [sequelize.fn('SUM', sequelize.col('kuantitas')), 'total_terjual']
        ],
        where: {
          ...whereClause,
          barang_handmade_id: { [Op.not]: null }
        },
        include: [{
          model: BarangHandmade,
          as: "barang_handmade",
          attributes: ['nama_barang', 'image']
        }],
        group: ['nama_barang', 'image'],
        order: [[sequelize.fn('SUM', sequelize.col('kuantitas')), 'DESC']],
        limit: 1
      }),

      // Get Non-Handmade products
      ProdukPenjualan.findAll({
        attributes: [
          'barang_non_handmade_id',
          [sequelize.fn('SUM', sequelize.col('kuantitas')), 'total_terjual']
        ],
        where: {
          ...whereClause,
          barang_non_handmade_id: { [Op.not]: null }
        },
        include: [{
          model: BarangNonHandmade,
          as: "barang_non_handmade",
          attributes: ['nama_barang', 'image']
        }],
        group: ['nama_barang', 'image'],
        order: [[sequelize.fn('SUM', sequelize.col('kuantitas')), 'DESC']],
        limit: 1
      }),

      // Get Custom products
      ProdukPenjualan.findAll({
        attributes: [
          'barang_custom_id',
          [sequelize.fn('SUM', sequelize.col('kuantitas')), 'total_terjual']
        ],
        where: {
          ...whereClause,
          barang_custom_id: { [Op.not]: null }
        },
        include: [{
          model: BarangCustom,
          as: "barang_custom",
          attributes: ['nama_barang', 'image']
        }],
        group: ['nama_barang', 'image'],
        order: [[sequelize.fn('SUM', sequelize.col('kuantitas')), 'DESC']],
        limit: 1
      }),

      // Get Packaging
      ProdukPenjualan.findAll({
        attributes: [
          'packaging_id',
          [sequelize.fn('SUM', sequelize.col('kuantitas')), 'total_terjual']
        ],
        where: {
          ...whereClause,
          packaging_id: { [Op.not]: null }
        },
        include: [{
          model: Packaging,
          as: "packaging",
          attributes: ['nama_packaging', 'image']
        }],
        group: ['nama_packaging', 'image'],
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
        id: nonhandmade[0].barang_non_handmade_id,
        image: nonhandmade[0].barang_non_handmade.image,
        nama: nonhandmade[0].barang_non_handmade.nama_barang,
        total_terjual: parseInt(nonhandmade[0].dataValues.total_terjual),
        kategori: 'Non-Handmade'
      } : null,
      custom: custom[0] ? {
        id: custom[0].barang_custom_id,
        image: custom[0].barang_custom.image,
        nama: custom[0].barang_custom.nama_barang,
        total_terjual: parseInt(custom[0].dataValues.total_terjual),
        kategori: 'Custom'
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
  
  static async getAllTerlarisByToko(toko_id, startDate, endDate) {
    const whereClause = {
      is_deleted: false
    };

    if (startDate && endDate) {
      whereClause.createdAt = {
        [Op.between]: [startDate, endDate]
      };
    }
    let includeConditions = [];
    if (toko_id !== null && toko_id !== undefined) {
      includeConditions = [
        {
          model: Cabang,
          as: 'cabang',
          where: { toko_id: toko_id },
          attributes: []
        }
      ];
    }
    
    const [handmade, nonhandmade, custom, packaging] = await Promise.all([
      // Get Handmade products
      ProdukPenjualan.findAll({
        attributes: [
          'barang_handmade_id',
          [sequelize.fn('SUM', sequelize.col('kuantitas')), 'total_terjual']
        ],
        where: {
          ...whereClause,
          barang_handmade_id: { [Op.not]: null }
        },
        include: [
          ...includeConditions,
          {
            model: BarangHandmade,
            as: "barang_handmade",
            attributes: ['nama_barang', 'image']
          }
        ],
        group: ['nama_barang', 'image']
      }),

      // Get Non-Handmade products
      ProdukPenjualan.findAll({
        attributes: [
          'barang_non_handmade_id',
          [sequelize.fn('SUM', sequelize.col('kuantitas')), 'total_terjual']
        ],
        where: {
          ...whereClause,
          barang_non_handmade_id: { [Op.not]: null }
        },
        include: [
          ...includeConditions,
          {
            model: BarangNonHandmade,
            as: "barang_non_handmade",
            attributes: ['nama_barang', 'image']
          }
        ],
        group: ['nama_barang', 'image']
      }),

      // Get Custom products
      ProdukPenjualan.findAll({
        attributes: [
          'barang_custom_id',
          [sequelize.fn('SUM', sequelize.col('kuantitas')), 'total_terjual']
        ],
        where: {
          ...whereClause,
          barang_custom_id: { [Op.not]: null }
        },
        include: [
          ...includeConditions,
          {
            model: BarangCustom,
            as: "barang_custom",
            attributes: ['nama_barang', 'image']
          }
        ],
        group: ['nama_barang', 'image']
      }),

      // Get Packaging
      ProdukPenjualan.findAll({
        attributes: [
          'packaging_id',
          [sequelize.fn('SUM', sequelize.col('kuantitas')), 'total_terjual']
        ],
        where: {
          ...whereClause,
          packaging_id: { [Op.not]: null }
        },
        include: [
          ...includeConditions,
          {
            model: Packaging,
            as: "packaging",
            attributes: ['nama_packaging', 'image']
          }
        ],
        group: ['nama_packaging', 'image']
      })
    ]);

    const allProducts = [
      ...handmade.map(item => ({
        id: item.barang_handmade_id,
        image: item.barang_handmade.image,
        nama: item.barang_handmade.nama_barang,
        total_terjual: parseInt(item.dataValues.total_terjual),
        kategori: 'Handmade'
      })),
      ...nonhandmade.map(item => ({
        id: item.barang_non_handmade_id,
        image: item.barang_non_handmade.image,
        nama: item.barang_non_handmade.nama_barang,
        total_terjual: parseInt(item.dataValues.total_terjual),
        kategori: 'Non-Handmade'
      })),
      ...custom.map(item => ({
        id: item.barang_custom_id,
        image: item.barang_custom.image,
        nama: item.barang_custom.nama_barang,
        total_terjual: parseInt(item.dataValues.total_terjual),
        kategori: 'Custom'
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

  static async getAllTerlarisByCabang(cabang_id, startDate, endDate) {
    const whereConditions = {
      is_deleted: false,
      cabang_id: cabang_id
    }

    if (startDate && endDate) {
      whereConditions.createdAt = {
        [Op.between]: [startDate, endDate]
      }
    }

    const [handmade, nonhandmade, custom, packaging] = await Promise.all([
      ProdukPenjualan.findAll({
        attributes: [
          'barang_handmade_id',
          [sequelize.fn('SUM', sequelize.col('kuantitas')), 'total_terjual']
        ],
        where: {
          ...whereConditions,
          barang_handmade_id: { [Op.not]: null }
        },
        include: [
          {
            model: BarangHandmade,
            as: "barang_handmade",
            attributes: ['nama_barang', 'image']
          }],
        group: ['nama_barang', 'image'],
        order: [[sequelize.fn('SUM', sequelize.col('kuantitas')), 'DESC']],
      }),
      ProdukPenjualan.findAll({
        attributes: [
          'barang_non_handmade_id',
          [sequelize.fn('SUM', sequelize.col('kuantitas')), 'total_terjual'],
        ],
        where: {
          ...whereConditions,
          barang_non_handmade_id: { [Op.not]: null }
        },
        include: [
          {
            model: BarangNonHandmade,
            as: "barang_non_handmade",
            attributes: ['nama_barang', 'image']
          }],
        group: ['nama_barang', 'image'],
        order: [[sequelize.fn('SUM', sequelize.col('kuantitas')), 'DESC']],
      }),
      ProdukPenjualan.findAll({
        attributes: [
          'barang_custom_id',
          [sequelize.fn('SUM', sequelize.col('kuantitas')), 'total_terjual']
        ],
        where: {
          ...whereConditions,
          barang_custom_id: { [Op.not]: null }
        },
        include: [
          {
            model: BarangCustom,
            as: "barang_custom",
            attributes: ['nama_barang', 'image']
          }],
        group: ['nama_barang', 'image'],
        order: [[sequelize.fn('SUM', sequelize.col('kuantitas')), 'DESC']],
      }),
      ProdukPenjualan.findAll({
        attributes: [
          'packaging_id',
          [sequelize.fn('SUM', sequelize.col('kuantitas')), 'total_terjual']
        ],
        where: {
          ...whereConditions,
          packaging_id: { [Op.not]: null }
        },
        include: [
          {
            model: Packaging,
            as: "packaging",
            attributes: ['nama_packaging', 'image']
          }],
        group: ['nama_packaging', 'image'],
        order: [[sequelize.fn('SUM', sequelize.col('kuantitas')), 'DESC']],
      })
    ]);

    const allProducts = [
      ...handmade.map((product) => ({
        id: product.barang_handmade_id,
        name: product.barang_handmade.nama_barang,
        image: product.barang_handmade.image,
        total_terjual: parseInt(product.dataValues.total_terjual),
        kategori: "Handmade",
      })),
      ...nonhandmade.map((product) => ({
        id: product.barang_non_handmade_id,
        name: product.barang_non_handmade.nama_barang,
        image: product.barang_non_handmade.image,
        total_terjual: parseInt(product.dataValues.total_terjual),
        kategori: "Non Handmade",
      })),
      ...custom.map((product) => ({
        id: product.barang_custom_id,
        name: product.barang_custom.nama_barang,
        image: product.barang_custom.image,
        total_terjual: parseInt(product.dataValues.total_terjual),
        kategori: "Custom",
      })),
      ...packaging.map((product) => ({
        id: product.packaging_id,
        name: product.packaging.nama_packaging,
        image: product.packaging.image,
        total_terjual: parseInt(product.dataValues.total_terjual),
        kategori: "Packaging",
      })),
    ];

    return allProducts
      .sort((a, b) => b.total_terjual - a.total_terjual)
      .slice(0, 10);
  }

  static async getTopTenTerlarisByToko(toko_id, startDate, endDate) {
    const whereClause = {
      is_deleted: false
    };

    if (startDate && endDate) {
      whereClause.createdAt = {
        [Op.between]: [startDate, endDate]
      };
    }
    let includeConditions = [];

    if (toko_id !== null && toko_id !== undefined) {
      includeConditions = [
        {
          model: Cabang,
          as: 'cabang',
          where: { toko_id: toko_id },
          attributes: []
        }
      ];
    }

    const [handmade, nonhandmade, custom, packaging] = await Promise.all([
      // Get Handmade products
      ProdukPenjualan.findAll({
        attributes: [
          'barang_handmade_id',
          [sequelize.fn('SUM', sequelize.col('kuantitas')), 'total_terjual']
        ],
        where: {
          ...whereClause,
          barang_handmade_id: { [Op.not]: null }
        },
        include: [
          ...includeConditions,
          {
            model: BarangHandmade,
            as: "barang_handmade",
            attributes: ['nama_barang', 'image']
          }
        ],
        group: ['nama_barang', 'image']
      }),

      // Get Non-Handmade products
      ProdukPenjualan.findAll({
        attributes: [
          'barang_non_handmade_id',
          [sequelize.fn('SUM', sequelize.col('kuantitas')), 'total_terjual']
        ],
        where: {
          ...whereClause,
          barang_non_handmade_id: { [Op.not]: null }
        },
        include: [
          ...includeConditions,
          {
            model: BarangNonHandmade,
            as: "barang_non_handmade",
            attributes: ['nama_barang', 'image']
          }
        ],
        group: ['nama_barang', 'image']
      }),

      // Get Custom products
      ProdukPenjualan.findAll({
        attributes: [
          'barang_custom_id',
          [sequelize.fn('SUM', sequelize.col('kuantitas')), 'total_terjual']
        ],
        where: {
          ...whereClause,
          barang_custom_id: { [Op.not]: null }
        },
        include: [
          ...includeConditions,
          {
            model: BarangCustom,
            as: "barang_custom",
            attributes: ['nama_barang', 'image']
          }
        ],
        group: ['nama_barang', 'image']
      }),

      // Get Packaging
      ProdukPenjualan.findAll({
        attributes: [
          'packaging_id',
          [sequelize.fn('SUM', sequelize.col('kuantitas')), 'total_terjual']
        ],
        where: {
          ...whereClause,
          packaging_id: { [Op.not]: null }
        },
        include: [
          ...includeConditions,
          {
            model: Packaging,
            as: "packaging",
            attributes: ['nama_packaging', 'image']
          }
        ],
        group: ['nama_packaging', 'image']
      })
    ]);

    const allProducts = [
      ...handmade.map(item => ({
        id: item.barang_handmade_id,
        image: item.barang_handmade.image,
        nama: item.barang_handmade.nama_barang,
        total_terjual: parseInt(item.dataValues.total_terjual),
        kategori: 'Handmade'
      })),
      ...nonhandmade.map(item => ({
        id: item.barang_non_handmade_id,
        image: item.barang_non_handmade.image,
        nama: item.barang_non_handmade.nama_barang,
        total_terjual: parseInt(item.dataValues.total_terjual),
        kategori: 'Non-Handmade'
      })),
      ...custom.map(item => ({
        id: item.barang_custom_id,
        image: item.barang_custom.image,
        nama: item.barang_custom.nama_barang,
        total_terjual: parseInt(item.dataValues.total_terjual),
        kategori: 'Custom'
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

  static async getTopTenTerlarisByCabang(cabang_id, startDate, endDate) {
    const whereClause = {
      is_deleted: false,
      cabang_id: cabang_id
    };

    if (startDate && endDate) {
      whereClause.createdAt = {
        [Op.between]: [startDate, endDate]
      };
    }

    const [handmade, nonhandmade, custom, packaging] = await Promise.all([
      // Get Handmade products
      ProdukPenjualan.findAll({
        attributes: [
          'barang_handmade_id',
          [sequelize.fn('SUM', sequelize.col('kuantitas')), 'total_terjual']
        ],
        where: {
          ...whereClause,
          barang_handmade_id: { [Op.not]: null }
        },
        include: [{
          model: BarangHandmade,
          as: "barang_handmade",
          attributes: ['nama_barang', 'image']
        }],
        group: ['nama_barang', 'image']
      }),

      // Get Non-Handmade products
      ProdukPenjualan.findAll({
        attributes: [
          'barang_non_handmade_id',
          [sequelize.fn('SUM', sequelize.col('kuantitas')), 'total_terjual']
        ],
        where: {
          ...whereClause,
          barang_non_handmade_id: { [Op.not]: null }
        },
        include: [{
          model: BarangNonHandmade,
          as: "barang_non_handmade",
          attributes: ['nama_barang', 'image']
        }],
        group: ['nama_barang', 'image']
      }),

      // Get Custom products
      ProdukPenjualan.findAll({
        attributes: [
          'barang_custom_id',
          [sequelize.fn('SUM', sequelize.col('kuantitas')), 'total_terjual']
        ],
        where: {
          ...whereClause,
          barang_custom_id: { [Op.not]: null }
        },
        include: [{
          model: BarangCustom,
          as: "barang_custom",
          attributes: ['nama_barang', 'image']
        }],
        group: ['nama_barang', 'image']
      }),

      // Get Packaging
      ProdukPenjualan.findAll({
        attributes: [
          'packaging_id',
          [sequelize.fn('SUM', sequelize.col('kuantitas')), 'total_terjual']
        ],
        where: {
          ...whereClause,
          packaging_id: { [Op.not]: null }
        },
        include: [{
          model: Packaging,
          as: "packaging",
          attributes: ['nama_packaging', 'image']
        }],
        group: ['nama_packaging', 'image']
      })
    ]);

    const allProducts = [
      ...handmade.map(item => ({
        id: item.barang_handmade_id,
        image: item.barang_handmade.image,
        nama: item.barang_handmade.nama_barang,
        total_terjual: parseInt(item.dataValues.total_terjual),
        kategori: 'Handmade'
      })),
      ...nonhandmade.map(item => ({
        id: item.barang_non_handmade_id,
        image: item.barang_non_handmade.image,
        nama: item.barang_non_handmade.nama_barang,
        total_terjual: parseInt(item.dataValues.total_terjual),
        kategori: 'Non-Handmade'
      })),
      ...custom.map(item => ({
        id: item.barang_custom_id,
        image: item.barang_custom.image,
        nama: item.barang_custom.nama_barang,
        total_terjual: parseInt(item.dataValues.total_terjual),
        kategori: 'Custom'
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
}

// Helper function to determine field name and value dynamically
function getFieldAndValue(produk) {
  if (produk.packaging_id) return { fieldName: "packaging_id", fieldValue: produk.packaging_id };
  if (produk.barang_custom_id) return { fieldName: "barang_custom_id", fieldValue: produk.barang_custom_id };
  if (produk.barang_non_handmade_id) return { fieldName: "barang_non_handmade_id", fieldValue: produk.barang_non_handmade_id };
  if (produk.barang_handmade_id) return { fieldName: "barang_handmade_id", fieldValue: produk.barang_handmade_id };
  return { fieldName: null, fieldValue: null };
}
module.exports = ProdukPenjualanService;
