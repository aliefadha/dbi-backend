const { sequelize } = require("../models");
const MetodePembayaran = require("../models/metodePembayaran");
const Pembelian = require("../models/pembelian");  
const ProdukPembelianService = require("./produkPembelianService");
const { Op } = require("sequelize");
  
class PembelianService {  
  static async create(data) {  
    const transaction = await sequelize.transaction();  
    try {  
      const pembelian = await Pembelian.create(data, { transaction });  
      const produkPembelian = data.produk.map(item => ({
        ...item,
        pembelian_id: pembelian.pembelian_id,
        toko_id: pembelian.toko_id
      }));

      await ProdukPembelianService.createMany(produkPembelian, { transaction });

      await transaction.commit();  
      return pembelian;  
    } catch (error) {  
      await transaction.rollback();  
      throw error;  
    }  
  }  
  
  static async getAll(bulan, tahun, toko_id) {  
    // Set default values to current month and year if not provided
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth() + 1; // getMonth() returns 0-11
    const currentYear = currentDate.getFullYear();

    bulan = bulan || currentMonth;
    tahun = tahun || currentYear;

    const startDate = new Date(tahun, bulan-1, 1);
    const endDate = new Date(tahun, bulan, 0);
    endDate.setHours(23, 59, 59, 999);
    const whereConditions = {
      is_deleted: false,
      tanggal: {
          [Op.between]: [startDate, endDate]
        }
    }

    if (toko_id) {
      whereConditions.toko_id = toko_id
    }
    const data = await Pembelian.findAll({
      where: whereConditions,
      attributes: {
        exclude: ["is_deleted"]
      },
      include: [
        {
          model: MetodePembayaran,
          as: "metode_pembayaran",
          attributes: ["nama_metode"]
        }
      ],
      order: [
        ['tanggal', 'DESC']
      ]
    });  

    const transformedData = await Promise.all(data.map(async (pembelian) => {
      const plainPembelian = pembelian.get({ plain: true });

      const produk = await ProdukPembelianService.getAllByPembelianId(pembelian.pembelian_id);
      plainPembelian.produk = produk;
      
      return plainPembelian;
    }));

    return transformedData;
  }  
  
  
  static async getById(id) {  
    const pembelianData = await Pembelian.findOne({
      where: {
        pembelian_id: id,
        is_deleted: false
      },
      attributes: {
        exclude: ["is_deleted"]
      },
      include: [
        {
          model: MetodePembayaran,
          as: "metode_pembayaran",
          attributes: ["nama_metode"]
        }
      ]
    });

    if (pembelianData) {
      const pembelian = pembelianData.get({ plain: true }); 

      const produk = await ProdukPembelianService.getAllByPembelianId(id);
      pembelian.produk = produk;
      return pembelian;
    }

  }  
  
  static async update(id, data) {  
    const transaction = await sequelize.transaction();  
    try {  
      const pembelian = await Pembelian.findOne({
        where: {
          pembelian_id: id,
          is_deleted: false
        }
      });  
      if (!pembelian) return null;  
      await pembelian.update(data, { transaction });  

      if (data.produk && Array.isArray(data.produk)) {  
        // Update or create new produk  
        const produkData = data.produk.map(item => (  
          {  
            ...item,  
            pembelian_id: id,
            toko_id: data.toko_id
          }  
        ));  
        await ProdukPembelianService.updateMany(produkData, { transaction });  
      }
      await transaction.commit();  
      
      const updatedPembelian = await this.getById(id);
      return updatedPembelian;  
    } catch (error) {  
      await transaction.rollback();  
      throw error;  
    }
  }  
  
  static async delete(id) {  
    const pembelian = await Pembelian.findByPk(id);  
    if (!pembelian) return null;
    await pembelian.update({ is_deleted: true }); 
    return true;  
  }  
}  
  
module.exports = PembelianService;
