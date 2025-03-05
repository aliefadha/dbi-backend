const { Op } = require("sequelize");
const { sequelize } = require("../models");
const MetodePembayaran = require("../models/metodePembayaran");
const Penjualan = require("../models/penjualan");  
const RincianBiayaCustom = require("../models/rincianBiayaCustom");
const ProdukPenjualanService = require("./produkPenjualanService");
const RincianBiayaCustomService = require("./rincianBiayaCustomService");
const Cabang = require("../models/cabang");
const Toko = require("../models/toko");
const ProdukPenjualan = require("../models/produkPenjualan");
require('dotenv').config();
  
class PenjualanService {  
  static async create(data) {  
    const transaction = await sequelize.transaction();
    try {
      const penjualan = await Penjualan.create(data, { transaction });
      const produkPenjualan = data.produk.map(item => ({
        ...item,
        penjualan_id: penjualan.penjualan_id,
        cabang_id: penjualan.cabang_id,
      }));

      await ProdukPenjualanService.createMany(produkPenjualan, { transaction });

      if (data.rincian_biaya_custom && Array.isArray(data.rincian_biaya_custom)) {
        const rincianBiayaCustom = data.rincian_biaya_custom.map(item => ({
          ...item,
          penjualan_id: penjualan.penjualan_id
        }));
  
        await RincianBiayaCustomService.create(rincianBiayaCustom, { transaction });  
      }
      

      await transaction.commit();
      return penjualan;
    } catch (error) {
      await transaction.rollback();
      throw error;
    }    
  }  
  
  static async getAll(bulan, tahun, cabang, toko_id) {  
    const startDate = new Date(tahun, bulan-1, 1);
    const endDate = new Date(tahun, bulan, 0);
    endDate.setHours(23, 59, 59, 999);
    const whereConditions = {
      is_deleted: false,
      tanggal: {
        [Op.between]: [startDate, endDate]
      }
    };

    if (cabang) {
      whereConditions.cabang_id = cabang;
    }

    if (toko_id) {
      whereConditions.toko_id = toko_id;
    }

    const data = await Penjualan.findAll({
      where: whereConditions,
      attributes: {
        exclude: ["is_deleted", "createdAt", "updatedAt"]
      },
      include: [
        {
          model: Cabang,
          as: "cabang",
          attributes: ["nama_cabang"]
        },
        {
          model: MetodePembayaran,
          as: "metode_pembayaran",
          attributes: ["nama_metode"]
        },
        {
          model: RincianBiayaCustom,
          as: "rincian_biaya_custom",
          attributes: ["nama_biaya","jumlah_biaya"]
        }
      ],
      order: [
        ['tanggal', 'DESC']
      ]
    });  

    const transformedData = await Promise.all(data.map(async (penjualan) => {
        const plainPenjualan = penjualan.get({ plain:true });

        const produk = await ProdukPenjualanService.getAllByPenjualanId(penjualan.penjualan_id);
        plainPenjualan.produk = produk;

        return plainPenjualan;
    }));

    return transformedData;
  }  
  
  static async getById(id) {  
    const penjualanData = await Penjualan.findOne({
      where: {
        penjualan_id: id,
        is_deleted: false
      },
      attributes: {
        exclude: ["is_deleted", "createdAt", "updatedAt"]
      },
      include: [
        {
          model: Toko,
          as: "toko",
          attributes: ["image", "nama_toko"]
        },
        {
          model: Cabang,
          as: "cabang",
          attributes: ["nama_cabang"]
        },
        {
          model: MetodePembayaran,
          as: "metode_pembayaran",
          attributes: ["nama_metode"]
        },
        {
          model: RincianBiayaCustom,
          as: "rincian_biaya_custom",
          attributes: ["rincian_biaya_custom_id","nama_biaya","jumlah_biaya"]
        }
      ]
    });

    if (penjualanData) {
      const penjualan = penjualanData.get({ plain:true });

      const produk = await ProdukPenjualanService.getAllByPenjualanId(id);
      penjualan.produk = produk;
      return penjualan;
    }
  }  
  
  static async update(id, data) {  
    const transaction = await sequelize.transaction();

    try {
      const penjualan = await Penjualan.findOne({
        where: {
          penjualan_id: id,
          is_deleted: false
        }
      });

      if(!penjualan) return null;
      await penjualan.update(data, { transaction });

      if (data.produk && Array.isArray(data.produk)) {
        // Update or create new produk
        const produkData = data.produk.map(item => (
          {
            ...item,
            penjualan_id: id,
            cabang_id: penjualan.cabang_id  
          }
        ));
        await ProdukPenjualanService.updateMany(produkData, { transaction });
      }

      if (data.rincian_biaya_custom && Array.isArray(data.rincian_biaya_custom)) {
        const rincianBiayaCustom = data.rincian_biaya_custom.map(item => (
          {
            ...item,
            penjualan_id: id
          }
        ));
        await RincianBiayaCustomService.update(rincianBiayaCustom, { transaction });
      }
      await transaction.commit();

      const updatePenjualan = await this.getById(id);
      return updatePenjualan;
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }  
  
  static async delete(id) {  
    const penjualan = await Penjualan.findByPk(id);  
    if (!penjualan) return null;  
    await ProdukPenjualanService.delete(id);
    await penjualan.destroy();  
    return true;  
  }  

  static async generateInvoiceData(penjualan) {
    return {
    logoUrl: process.env.URL_LOCAL + "/images-toko/" + penjualan.toko.image, // Replace with actual logo URL
      address: penjualan.cabang.nama_cabang, // Replace with actual address
      items: penjualan.produk.map(item => {
        let productName = '';
        let productCode = '';
  
        if (item.barang_handmade) {
          productName = item.barang_handmade.nama_barang;
          productCode = item.barang_handmade.barang_handmade_id;
        } else if (item.barang_non_handmade) {
          productName = item.barang_non_handmade.nama_barang;
          productCode = item.barang_non_handmade.barang_non_handmade_id;
        } else if (item.barang_custom) {
          productName = item.barang_custom.nama_barang;
          productCode = item.barang_custom.barang_custom_id;
        } else if (item.packaging) {
          productName = item.packaging.nama_barang;
          productCode = item.packaging.packaging_id;
        }
  
        return {
          code: productCode,
          name: productName,
          qty: item.kuantitas,
          price: item.harga_satuan
        };
      }),
      totalItems: penjualan.produk.length,
      totalQty: penjualan.produk.reduce((total, item) => total + item.kuantitas, 0),
      subtotal: penjualan.produk.reduce((total, item) => total + (item.kuantitas * item.harga_satuan), 0),
      discount: penjualan.diskon || 0, // Assuming 'diskon' is a field in penjualan
      tax: penjualan.pajak || 0, // Assuming 'pajak' is a field in penjualan
      total: penjualan.total, // Assuming 'total' is a field in penjualan
      invoiceNumber: penjualan.penjualan_id, // Assuming 'nomor_invoice' is a field in penjualan
      date: new Date(penjualan.tanggal).toLocaleDateString('id-ID'), // Assuming 'tanggal' is a field in penjualan
      time: new Date(penjualan.tanggal).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }), // Assuming 'tanggal' is a field in penjualan
      instagram: "@tatitatu" // Replace with actual Instagram handle
    };
  }

  static async getInvoice(id) {
    const penjualan = await this.getById(id);
    if (!penjualan) {
      return null;
    }
  
    return this.generateInvoiceData(penjualan);
  }

  static async getTimeFrequencyToko(toko_id, startDate, endDate, cabang_id) {
      const whereConditions = {
        toko_id,
        tanggal: {
          [Op.between]: [startDate, endDate]
        },
        is_deleted: false
      };
  
      if (cabang_id) {
        whereConditions.cabang_id = cabang_id;
      }
  
      // Get hourly transaction counts with cabang info
      const hourlyData = await Penjualan.findAll({
        where: whereConditions,
        attributes: [
          [sequelize.fn('strftime', '%w', sequelize.col('Penjualan.tanggal')), 'day_number'],
          [sequelize.fn('strftime', '%H', sequelize.col('Penjualan.tanggal')), 'hour'],
          [sequelize.fn('COUNT', sequelize.col('Penjualan.penjualan_id')), 'transaction_count'],
          [sequelize.fn('SUM', sequelize.col('Penjualan.total_penjualan')), 'total_sales'],
          [sequelize.col('Penjualan.cabang_id'), 'cabang_id']
        ],
        include: [{
          model: Cabang,
          as: 'cabang',
          attributes: ['nama_cabang']
        }],
        group: [
          'Penjualan.cabang_id',
          sequelize.fn('strftime', '%w', sequelize.col('Penjualan.tanggal')),
          sequelize.fn('strftime', '%H', sequelize.col('Penjualan.tanggal'))
        ],
        order: [
          [sequelize.col('Penjualan.cabang_id'), 'ASC'],
          [sequelize.fn('strftime', '%w', sequelize.col('Penjualan.tanggal')), 'ASC'],
          [sequelize.literal('transaction_count DESC')]
        ],
        raw: false
      });
  
      // Get daily quantities with cabang info
      const quantityData = await ProdukPenjualan.findAll({
        attributes: [
          [sequelize.fn('strftime', '%w', sequelize.col('penjualan.tanggal')), 'day_number'],
          [sequelize.fn('SUM', sequelize.col('produk_penjualan.kuantitas')), 'total_quantity'],
          [sequelize.col('penjualan.cabang_id'), 'cabang_id']
        ],
        include: [{
          model: Penjualan,
          as: 'penjualan',
          attributes: [],
          where: whereConditions
        }],
        group: [
          'penjualan.cabang_id',
          sequelize.fn('strftime', '%w', sequelize.col('penjualan.tanggal'))
        ],
        raw: true
      });
  
      const dayNames = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
      const cabangPatterns = {};
      
      if (hourlyData.length === 0) {
        return cabang_id ? [] : [];
      }
  
      hourlyData.forEach(record => {
        if (!record || !record.cabang) return;

        const cabangId = record.get('cabang_id');
        const cabangName = record.cabang?.nama_cabang || 'Unknown';
        const dayNumber = record.get('day_number');
        const hour = parseInt(record.get('hour')) || 0;
        const count = parseInt(record.get('transaction_count')) || 0;
        const sales = parseInt(record.get('total_sales')) || 0;

        if (!cabangId || dayNumber === null || dayNumber === undefined) return;

        if (!cabangPatterns[cabangId]) {
          cabangPatterns[cabangId] = {
            cabang_id: cabangId,
            cabang_name: cabangName,
            daily_stats: {}
          };
        }

        if (!cabangPatterns[cabangId].daily_stats[dayNumber] || 
            count > (cabangPatterns[cabangId].daily_stats[dayNumber]?.peak_count || 0)) {
          cabangPatterns[cabangId].daily_stats[dayNumber] = {
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
        
        const cabangId = record.cabang_id;
        const dayNumber = record.day_number;
        if (cabangPatterns[cabangId]?.daily_stats?.[dayNumber]) {
          cabangPatterns[cabangId].daily_stats[dayNumber].total_quantity = 
            parseInt(record.total_quantity) || 0;
        }
      });
  
      if (cabang_id) {
        // Return single cabang format
        const cabangData = cabangPatterns[cabang_id];
        if (!cabangData) return []; // Return empty array if no data found for cabang_id
        
        return Object.values(cabangData.daily_stats).map(day => ({
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
  
      // Return multi-cabang format
      return Object.values(cabangPatterns).map(cabang => ({
        cabang_id: cabang.cabang_id,
        cabang_name: cabang.cabang_name,
        daily_stats: Object.values(cabang.daily_stats).map(day => ({
          day: day.day,
          peak_hour: {
            start: day.peak_hour_start,
            end: day.peak_hour_end,
            transactions: day.peak_count
          },
          total_quantity: day.total_quantity,
          total_sales: day.total_sales
        }))
      }));
    }
}  
  
module.exports = PenjualanService;
