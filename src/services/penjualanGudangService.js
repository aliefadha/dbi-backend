const { Op } = require("sequelize");
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
        }
      ]
    });

    const transformedData = await Promise.all(data.map(async (penjualan) => {
      const plainPenjualan = penjualan.get({ plain: true });
      
      // Transform metode_pembayaran to metode
      plainPenjualan.metode = plainPenjualan.metode_pembayaran?.nama_metode || 'cash';
      delete plainPenjualan.metode_pembayaran;

      // Get products using ProdukPenjualanGudangService
      const produk = await ProdukPenjualanGudangService.getAllByPenjualanId(penjualan.penjualan_id);
      plainPenjualan.produk = produk;

      return plainPenjualan;
    }));

    return transformedData;
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
  
      const data = await PenjualanGudang.findAll({
        where: whereClause,
        attributes: {
          exclude: ["is_deleted", "metode_id"]
        },
        include: [
          {
            model: MetodePembayaranGudang,
            as: "metode_pembayaran",
            attributes: ["nama_metode"]
          }
        ]
      });
  
      const transformedData = await Promise.all(data.map(async (penjualan) => {
        const plainPenjualan = penjualan.get({ plain: true });
        // Transform metode_pembayaran to metode
        plainPenjualan.metode = plainPenjualan.metode_pembayaran?.nama_metode || 'cash';
        delete plainPenjualan.metode_pembayaran;
        // Get products using ProdukPenjualanGudangService
        const produk = await ProdukPenjualanGudangService.getAllByPenjualanId(penjualan.penjualan_id);
        plainPenjualan.produk = produk;
        return plainPenjualan;
      }));
      return transformedData;
    }

  static async getById(id) {
    const penjualanData = await PenjualanGudang.findOne({
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
      ]
    });

    if (penjualanData) {
      const penjualan = penjualanData.get({ plain: true });
      penjualan.metode = penjualan.metode_pembayaran?.nama_metode || 'cash';
      delete penjualan.metode_pembayaran;
      
      const produk = await ProdukPenjualanGudangService.getAllByPenjualanId(id);
      penjualan.produk = produk;
      return penjualan;
    }
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
        // Update or create new produk with all transaction details
        const produkWithDetails = {
          penjualan_id: id,  // Pass the penjualan_id
          produk: produk.map(item => ({
            ...item,
            penjualan_id: id  // Add penjualan_id to each product
          }))
        };

        await ProdukPenjualanGudangService.updateMany(produkWithDetails, { transaction });
      }

      await transaction.commit();

      return penjualanGudang;
    } catch (error) {
      await transaction.rollback();
      throw new Error(`Failed to update sale: ${error.message}`);
    }
  }

  static async delete(id) {
    const penjualanGudang = await PenjualanGudang.findByPk(id);
    if (!penjualanGudang) return null;
    await penjualanGudang.update({ is_deleted: true });
    await penjualanGudang.save();
    return true;
  }

}

module.exports = PenjualanGudangService;
