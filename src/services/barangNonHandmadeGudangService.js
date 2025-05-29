const BarangNonHandmadeGudang = require("../models/barangNonHandmadeGudang");
const KategoriBarangGudang = require("../models/kategoriBarangGudang");
const sequelize = require("../config/database");
const CustomIdGenerateService = require("./customIdGenerateService");
const StokBarangGudang = require("../models/stokBarangGudang");

class BarangNonHandmadeGudangService {
  static async create(data) {
    const transaction = await sequelize.transaction();

    try {
      const {
        image,
        barang_nonhandmade_id,
        kategori_barang_id,
        nama_barang,
        jumlah_minimum_stok,
        total_hpp,
        keuntungan,
        harga_jual
      } = data;

      const barangNonHandmadeGudang = await BarangNonHandmadeGudang.create({
        image,
        barang_nonhandmade_id,
        kategori_barang_id,
        nama_barang,
        jumlah_minimum_stok,
        total_hpp,
        keuntungan,
        harga_jual
      }, { transaction });

      await transaction.commit();

      return {
        barang_nonhandmade: barangNonHandmadeGudang
      };
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  static async getAll() {
    return await BarangNonHandmadeGudang.findAll({
      where: {
        is_deleted: false
      },
      attributes: {
        exclude: ["kategori_barang_id", "jenis_barang_id"]
      },
      include: [
        {
          model: KategoriBarangGudang,
          as: 'kategori',
          where: {
            is_deleted: false
          },
          attributes: ["nama_kategori_barang"]
        },
        {
          model: StokBarangGudang,
          as: "stok_barang",
          attributes: ["jumlah_stok"]
        }
      ],
      order: [["createdAt", "DESC"]]
    });
  }

  static async getById(id) {
    return await BarangNonHandmadeGudang.findOne({
      where: {
        barang_nonhandmade_id: id,
        is_deleted: false,
      },
      attributes: {
        exclude: ["kategori_barang_id", "jenis_barang_id"]
      },
      include: [
        {
          model: KategoriBarangGudang,
          as: 'kategori',
          where: {
            is_deleted: false
          },
          attributes: ["nama_kategori_barang"]
        },
        {
          model: StokBarangGudang,
          as: "stok_barang",
          attributes: ["jumlah_stok"]
        }
      ]
    });
  }

  static async update(id, data) {
    const transaction = await sequelize.transaction();

    try {
      const {
        image,
        kategori_barang_id,
        nama_barang,
        jumlah_minimum_stok,
        ...otherData
      } = data;

      const barangNonHandmadeGudang = await BarangNonHandmadeGudang.findOne({
        where: {
          barang_nonhandmade_id: id,
          is_deleted: false
        }
      });

      if (!barangNonHandmadeGudang) return null;

      await barangNonHandmadeGudang.update({
        image,
        kategori_barang_id,
        nama_barang,
        jumlah_minimum_stok,
        ...otherData
      }, { transaction });

      await transaction.commit();

      const updatedBarangNonHandmadeGudang = await this.getById(id);
      return updatedBarangNonHandmadeGudang;
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  static async delete(id) {
    const barangNonHandmadeGudang = await BarangNonHandmadeGudang.findByPk(id);
    if (!barangNonHandmadeGudang) return null;
    await barangNonHandmadeGudang.destroy();
    return true;
  }

  static async createWithDetails(barangData) {
    const transaction = await sequelize.transaction();

    try {
      const newId = await CustomIdGenerateService.generateBarangNonHandmadeGudangId();
      barangData.barang_nonhandmade_id = newId;

      const barangNonHandmadeGudang = await BarangNonHandmadeGudang.create(barangData, { transaction });

      await transaction.commit();

      return {
        barangNonHandmade: barangNonHandmadeGudang
      };
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }
}

module.exports = BarangNonHandmadeGudangService;
