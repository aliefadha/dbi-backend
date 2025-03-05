const MetodePembayaranGudang = require("../models/metodePembayaranGudang");
const PembelianGudang = require("../models/pembelianGudang");
const { sequelize } = require("../models");
const ProdukPembelianGudangService = require("./produkPembelianGudangService");
const { Op } = require("sequelize");

class PembelianGudangService {
  static async create(data) {
    const transaction = await sequelize.transaction();

    try {
      const { produk, ...pembelianData } = data;

      // Create the purchase record
      const pembelian = await PembelianGudang.create(pembelianData, {
        transaction
      });

      // If products are provided, create them using ProdukPembelianGudangService
      if (produk && produk.length > 0) {
        // Add pembelian_id to each product
        const productsWithPembelianId = produk.map(item => ({
          ...item,
          pembelian_id: pembelian.pembelian_id
        }));

        await ProdukPembelianGudangService.createMany(productsWithPembelianId, { transaction });
      }

      await transaction.commit();
      return pembelian;
    } catch (error) {
      await transaction.rollback();
      throw new Error(`Failed to create purchase: ${error.message}`);
    }
  }

  static async getAll() {
    const data = await PembelianGudang.findAll({
      where: {
        is_deleted: false
      },
      attributes: {
        exclude: ["is_deleted", "metode_id"]
      },
      include: [
        {
          model: MetodePembayaranGudang,
          as: "metode_pembelian",
          attributes: ["nama_metode"],
        }
      ],
      order: [["tanggal", "DESC"]]
    });

    const transformedData = await Promise.all(data.map(async (pembelian) => {
      const plainPembelian = pembelian.get({ plain: true });
      
      // Transform metode_pembelian to metode
      plainPembelian.metode = plainPembelian.metode_pembelian?.nama_metode || 'cash';
      delete plainPembelian.metode_pembelian;

      // Get products using ProdukPembelianGudangService
      const produk = await ProdukPembelianGudangService.getAllByPembelianId(pembelian.pembelian_id);
      plainPembelian.produk = produk;

      return plainPembelian;
    }));

    return transformedData;
  }

  static async getById(id) {
    const pembelianData = await PembelianGudang.findOne({
      where: {
        pembelian_id: id,
        is_deleted: false
      },
      attributes: {
        exclude: ["is_deleted", "metode_id"]
      },
      include: [
        {
          model: MetodePembayaranGudang,
          as: "metode_pembelian",
          attributes: ["nama_metode"]
        },
      ]
    })

    if (pembelianData) {
      const pembelian = pembelianData.get({ plain: true });
      pembelian.metode = pembelian.metode_pembelian?.nama_metode || 'cash';
      delete pembelian.metode_pembelian;
      
      const produk = await ProdukPembelianGudangService.getAllByPembelianId(id);
      pembelian.produk = produk;
      return pembelian;
    }
    
  }

  static async update(id, data) {
    const transaction = await sequelize.transaction();

    try {
      const { produk, ...pembelianData } = data;

      const pembelianGudang = await PembelianGudang.findOne({
        where: {
          pembelian_id: id,
          is_deleted: false
        }
      });

      if (!pembelianGudang) return null;

      await pembelianGudang.update(pembelianData, { transaction });

      if (produk && Array.isArray(produk)) {
        // Update or create new produk
        const produkData = produk.map(item => ({
          ...item,
          pembelian_id: id
        }));

        await ProdukPembelianGudangService.updateMany(produkData, { transaction });
      }

      await transaction.commit();

      const updatedPembelianGudang = await this.getById(id);
      return updatedPembelianGudang;
    } catch (error) {
      await transaction.rollback();
      throw new Error(`Failed to update purchase: ${error.message}`);
    }
  }

  static async delete(id) {
    const pembelianGudang = await PembelianGudang.findByPk(id);
    if (!pembelianGudang) return null;
    await ProdukPembelianGudangService.delete(id);
    await pembelianGudang.destroy();
    return true;
  }

  static async getAllByDate(startDate, endDate) {
    const whereClause = {
      is_deleted: false
    };

    // Only add date filter if both dates are provided
    if (startDate && endDate) {
      whereClause.tanggal = {
        [Op.between]: [startDate, endDate]
      };
    }

    const data = await PembelianGudang.findAll({
      where: whereClause,
      attributes: {
        exclude: ["is_deleted", "metode_id"]
      },
      include: [
        {
          model: MetodePembayaranGudang,
          as: "metode_pembelian",
          attributes: ["nama_metode"]
        }
      ]
    });

    const transformedData = await Promise.all(data.map(async (pembelian) => {
      const plainPembelian = pembelian.get({ plain: true });
      // Transform metode_pembelian to metode
      plainPembelian.metode = plainPembelian.metode_pembelian?.nama_metode || 'cash';
      delete plainPembelian.metode_pembelian;
      // Get products using ProdukPembelianGudangService
      const produk = await ProdukPembelianGudangService.getAllByPembelianId(pembelian.pembelian_id);
      plainPembelian.produk = produk;
      return plainPembelian;
    }));
    return transformedData;
  }
}

module.exports = PembelianGudangService;
