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
    await ProdukPenjualanGudangService.delete(id);
    await penjualanGudang.destroy();
    return true;
  }

  static async getTimeFrequencyToko(startDate, endDate) {
    if (!startDate || !endDate) {
      throw new Error("startDate and endDate are required");
    }

    const whereConditions = {
      tanggal: {
        [Op.between]: [startDate, endDate]
      },
      is_deleted: false
    };

    // Get hourly transaction counts
    const hourlyData = await PenjualanGudang.findAll({
      where: whereConditions,
      attributes: [
        [sequelize.fn('strftime', '%w', sequelize.col('penjualan_gudang.tanggal')), 'day_number'],
        [sequelize.fn('strftime', '%H', sequelize.col('penjualan_gudang.tanggal')), 'hour'],
        [sequelize.fn('COUNT', sequelize.col('penjualan_gudang.penjualan_id')), 'transaction_count'],
        [sequelize.fn('SUM', sequelize.col('penjualan_gudang.total_penjualan')), 'total_sales']
      ],
      group: [
        sequelize.fn('strftime', '%w', sequelize.col('penjualan_gudang.tanggal')),
        sequelize.fn('strftime', '%H', sequelize.col('penjualan_gudang.tanggal'))
      ],
      order: [
        [sequelize.fn('strftime', '%w', sequelize.col('penjualan_gudang.tanggal')), 'ASC'],
        [sequelize.literal('transaction_count DESC')]
      ],
      raw: false
    });

    // Get daily quantities
    const quantityData = await ProdukPenjualanGudang.findAll({
      attributes: [
        [sequelize.fn('strftime', '%w', sequelize.col('penjualan.tanggal')), 'day_number'],
        [sequelize.fn('SUM', sequelize.col('produk_penjualan_gudang.kuantitas')), 'total_quantity']
      ],
      include: [{
        model: PenjualanGudang,
        as: 'penjualan',
        attributes: [],
        where: whereConditions
      }],
      group: [
        sequelize.fn('strftime', '%w', sequelize.col('penjualan.tanggal'))
      ],
      raw: true
    });

    const dayNames = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
    const dailyStats = {};

    if (hourlyData.length === 0) {
      return [];
    }

    hourlyData.forEach(record => {
      if (!record) return;

      const dayNumber = record.get('day_number');
      const hour = parseInt(record.get('hour')) || 0;
      const count = parseInt(record.get('transaction_count')) || 0;
      const sales = parseInt(record.get('total_sales')) || 0;

      if (dayNumber === null || dayNumber === undefined) return;

      if (!dailyStats[dayNumber] || count > (dailyStats[dayNumber]?.peak_count || 0)) {
        dailyStats[dayNumber] = {
          day: dayNames[parseInt(dayNumber) || 0],
          peak_hour_start: `${hour.toString().padStart(2, '0')}:00`,
          peak_hour_end: `${hour.toString().padStart(2, '0')}:59`,
          peak_count: count,
          total_sales: sales,
          total_quantity: 0
        };
      }
    });

    // Add quantities to patterns
    quantityData.forEach(record => {
      if (!record) return;
      
      const dayNumber = record.day_number;
      if (dailyStats[dayNumber]) {
        dailyStats[dayNumber].total_quantity = parseInt(record.total_quantity) || 0;
      }
    });

    // Return daily stats
    return Object.values(dailyStats).map(day => ({
      day: day.day,
      peak_hour: {
        start: day.peak_hour_start,
        end: day.peak_hour_end,
        transactions: day.peak_count
      },
      total_quantity: day.total_quantity,
      total_sales: day.total_sales
    }));
  }

}

module.exports = PenjualanGudangService;
