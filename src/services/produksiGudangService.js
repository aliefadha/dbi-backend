const { sequelize } = require("../models");
const BarangHandmadeGudang = require("../models/barangHandmadeGudang");
const BarangProduksiGudang = require("../models/barangProduksiGudang");
const ProduksiGudang = require("../models/produksiGudang");
const BarangProduksiGudangService = require("./barangProduksiGudangService");

class ProduksiGudangService {
  static async create(data) {
    const transaction = await sequelize.transaction();
    try {
      const { jumlah_produksi, total_menit, image, tanggal, produk } = data;
      
      const produksi = await ProduksiGudang.create({
        jumlah_produksi,
        total_menit,
        image,
        tanggal,
      }, { transaction });

      if (produk && produk.length > 0) {
        const produkData = produk.map(item => ({
          ...item,
          produksi_gudang_id: produksi.produksi_gudang_id
        }));

        await BarangProduksiGudangService.createMany(produkData, { transaction }, false);
      }

      await transaction.commit();
      return produksi;
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  static async getAll() {
    return await ProduksiGudang.findAll({
      where: {
        is_deleted: false
      },
      include: [
        {
          model: BarangProduksiGudang,
          as: "produk",
          attributes: ["jumlah"],
          include: [
            {
              model: BarangHandmadeGudang,
              as: "barang",
              where: {
                is_deleted: false
              },
              attributes: ["barang_handmade_id", "nama_barang"]
            }
          ]
        }
      ]
    });
  }

  static async getById(id) {
    return await ProduksiGudang.findOne({
      where: {
        produksi_gudang_id: id,
        is_deleted: false
      },
      include: [
        {
          model: BarangProduksiGudang,
          as: "produk",
          attributes: ["jumlah"],
          include: [
            {
              model: BarangHandmadeGudang,
              as: "barang",
              where: {
                is_deleted: false
              },
              attributes: ["barang_handmade_id", "nama_barang"]
            }
          ]
        }
      ]
    });
  }

  static async update(id, data) {

    const transaction = await sequelize.transaction();
    try {
      const produksiGudang = await ProduksiGudang.findOne({
        where: {
          produksi_gudang_id: id,
          is_deleted: false
      }}, 
      { transaction });
      if (!produksiGudang) return null;
  
      Object.assign(produksiGudang, data);

      await produksiGudang.save({ transaction });
      
      await BarangProduksiGudangService.deleteByProduksi(id);

      const produkData = data.produk.map(item => ({
        ...item,
        produksi_gudang_id: produksiGudang.produksi_gudang_id
      }));

      await BarangProduksiGudangService.createMany(produkData, { transaction });
  
      await transaction.commit();
      return produksiGudang;
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  static async delete(id) {
    const produksiGudang = await ProduksiGudang.findByPk(id);
    if (!produksiGudang) return null;
    await produksiGudang.update({ is_deleted: true });
    return true;
  }
}

module.exports = ProduksiGudangService;
