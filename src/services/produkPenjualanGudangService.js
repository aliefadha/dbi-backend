const { sequelize } = require("../models");
const BarangNonHandmadeGudang = require("../models/barangNonHandmadeGudang");
const JenisBarangGudang = require("../models/jenisBarangGudang");
const PackagingGudang = require("../models/packagingGudang");
const ProdukPenjualanGudang = require("../models/produkPenjualanGudang");
const StokBarangGudang = require("../models/stokBarangGudang");

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
