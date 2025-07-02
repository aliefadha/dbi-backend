const BarangNonHandmadeGudang = require("../models/barangNonHandmadeGudang");
const KategoriBarangGudang = require("../models/kategoriBarangGudang");
const sequelize = require("../config/database");
const CustomIdGenerateService = require("./customIdGenerateService");
const StokBarangGudang = require("../models/stokBarangGudang");
const RincianBiayaGudangService = require("./rincianBiayaGudangService");
const RincianBiayaGudang = require("../models/rincianBiayaGudang");
const { Op } = require("sequelize");

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
        harga_jual,
        harga_jual_ideal,
        margin_persentase,
        margin_nominal,
        harga_logis,
        rincian_biaya
      } = data;

      const barangNonHandmadeGudang = await BarangNonHandmadeGudang.create({
        image,
        barang_nonhandmade_id,
        kategori_barang_id,
        nama_barang,
        jumlah_minimum_stok,
        total_hpp,
        keuntungan,
        harga_jual,
        harga_jual_ideal,
        margin_persentase,
        margin_nominal,
        harga_logis
      }, { transaction });

      for (const rincian of rincian_biaya) {
        await RincianBiayaGudangService.create({
          barang_nonhandmade_id: barangNonHandmadeGudang.barang_nonhandmade_id,
          rincian_biaya_id: rincian.rincian_biaya_id,
          nama_biaya: rincian.nama_biaya,
          jumlah_biaya: rincian.jumlah_biaya
        }, { transaction });
      }

      await transaction.commit();

      return {
        barang_nonhandmade: barangNonHandmadeGudang
      };
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  static async getAll(page = 1, limit = 1, search = "") {
    const offset = (page - 1) * limit;

    const whereConditions = {
      is_deleted: false
    }

    if (search) {
      whereConditions.nama_barang = { [Op.like]: `%${search}%` };
    }

    const { rows, count } = await BarangNonHandmadeGudang.findAndCountAll({
      where: whereConditions,
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
        },
        {
          model: RincianBiayaGudang,
          as: "rincian_biaya",
          attributes: {
            exclude: ["barang_handmade_id"]
          }
        }
      ],
      order: [["createdAt", "DESC"]],
      limit: parseInt(limit),
      offset: parseInt(offset),
      subQuery: false 
    });

    return {
      totalItems: count,
      data: rows,
      currentPage: parseInt(page),
      totalPages: Math.ceil(count / limit)
    };
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
        },
        {
          model: RincianBiayaGudang,
          as: "rincian_biaya",
          attributes: {
            exclude: ["barang_handmade_id"]
          }
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
        rincian_biaya,
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

      // Delete existing rincian biaya
      await RincianBiayaGudang.destroy({
        where: {
          barang_nonhandmade_id: id
        },
        transaction
      });

      // Create new rincian biaya
      if (rincian_biaya && rincian_biaya.length > 0) {
        for (const rincian of rincian_biaya) {
          await RincianBiayaGudangService.create({
            barang_nonhandmade_id: id,
            rincian_biaya_id: rincian.rincian_biaya_id,
            nama_biaya: rincian.nama_biaya,
            jumlah_biaya: rincian.jumlah_biaya
          }, { transaction });
        }
      }

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
