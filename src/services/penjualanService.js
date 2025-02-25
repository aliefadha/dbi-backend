const { Op } = require("sequelize");
const { sequelize } = require("../models");
const MetodePembayaran = require("../models/metodePembayaran");
const Penjualan = require("../models/penjualan");  
const RincianBiayaCustom = require("../models/rincianBiayaCustom");
const ProdukPenjualanService = require("./produkPenjualanService");
const RincianBiayaCustomService = require("./rincianBiayaCustomService");
const Cabang = require("../models/cabang");
  
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
    await penjualan.update({ is_deleted: true });  
    return true;  
  }  

  static async getInvoice(id) {
    const penjualan = this.getById(id);
    if(!penjualan) return null;
    return penjualan;
    // return {
    //   logoUrl: "/api/placeholder/150/50", // Replace with actual logo URL
    //   storeType: penjualan.cabang.nama_cabang,
    //   address: "Jln. Hayam Wuruk Padang", // Replace with actual address
    //   items: penjualan.produk.map(item => ({
    //     code: item.kode_produk, // Assuming each product has a 'kode_produk' field
    //     name: item.nama_produk, // Assuming each product has a 'nama_produk' field
    //     qty: item.qty, // Assuming each product has a 'qty' field
    //     price: item.harga // Assuming each product has a 'harga' field
    //   })),
    //   totalItems: penjualan.produk.length,
    //   totalQty: penjualan.produk.reduce((total, item) => total + item.qty, 0),
    //   subtotal: penjualan.produk.reduce((total, item) => total + (item.qty * item.harga), 0),
    //   discount: penjualan.diskon || 0, // Assuming 'diskon' is a field in penjualan
    //   tax: penjualan.pajak || 0, // Assuming 'pajak' is a field in penjualan
    //   total: penjualan.total, // Assuming 'total' is a field in penjualan
    //   invoiceNumber: penjualan.nomor_invoice, // Assuming 'nomor_invoice' is a field in penjualan
    //   date: new Date(penjualan.tanggal).toLocaleDateString('id-ID'), // Assuming 'tanggal' is a field in penjualan
    //   time: new Date(penjualan.tanggal).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }), // Assuming 'tanggal' is a field in penjualan
    //   instagram: "@tatitatu" // Replace with actual Instagram handle
    // };
  }
}  
  
module.exports = PenjualanService;  
