const sequelize = require("../config/database");
const BarangHandmadeGudang = require("../models/barangHandmadeGudang");
const BarangMentah = require("../models/barangMentah");
const KategoriBarangGudang = require("../models/kategoriBarangGudang");
const RincianBahanGudang = require("../models/rincianBahanGudang");
const RincianBahanGudangService = require("./rincianBahanGudangService");
const StokBarangGudang = require("../models/stokBarangGudang");
const RincianBiayaGudangService = require("./rincianBiayaGudangService");
const { Op } = require("sequelize");

class BarangHandmadeGudangService {
  static async create(data) {
    const transaction = await sequelize.transaction();

    try {
      const {
        image,
        barang_handmade_id,
        kategori_barang_id,
        nama_barang,
        jumlah_minimum_stok,
        total_hpp,
        keuntungan,
        harga_jual,
        waktu_pengerjaan,
        rincian_bahan,
        harga_jual_ideal,
        margin_persentase,
        margin_nominal,
        harga_logis
      } = data;

      const barangHandmadeGudang = await BarangHandmadeGudang.create({
        image,
        barang_handmade_id,
        kategori_barang_id,
        nama_barang,
        jumlah_minimum_stok,
        total_hpp,
        keuntungan,
        harga_jual,
        waktu_pengerjaan,
        harga_jual_ideal,
        margin_persentase,
        margin_nominal,
        harga_logis
      }, { transaction });

      if (!barangHandmadeGudang) {
        throw new Error('Failed to create barang handmade gudang');
      }

      const rincianBahanToCreate = rincian_bahan.map((bahan) => ({
        barang_handmade_id: barangHandmadeGudang.barang_handmade_id,
        barang_mentah_id: bahan.barang_mentah_id,
        harga_satuan: bahan.harga_satuan,
        kuantitas: bahan.kuantitas,
        total_biaya: bahan.total_biaya,
        is_deleted: false
      }));

      const createdRincianBahan = await RincianBahanGudangService.createMany(
        rincianBahanToCreate,
        { transaction }
      );

      if (!createdRincianBahan) {
        throw new Error('Failed to create rincian bahan');
      }

      await transaction.commit();

      return {
        barang_handmade: barangHandmadeGudang,
        rincian_bahan: createdRincianBahan
      };
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  static async getAll(page = 1, limit = 10, search = "", category) {
    const offset = (page - 1) * limit;

    const whereConditions = {
      is_deleted: false
    };

    if (category) {
      whereConditions.kategori_barang_id = category;
    }

    if (search) {
      whereConditions.nama_barang = { [Op.like]: `%${search}%` };
    }

    // 1. Fetch all matching IDs (avoid JOIN here)
    const matchingItems = await BarangHandmadeGudang.findAll({
      where: whereConditions,
      attributes: ["barang_handmade_id"],
      raw: true
    });

    const allIds = [...new Set(matchingItems.map(item => item.barang_handmade_id))];
    const totalItems = allIds.length;
    const totalPages = Math.ceil(totalItems / limit);
    const paginatedIds = allIds.slice(offset, offset + limit);

    // 2. Fetch full data by paginated IDs
    const rows = await BarangHandmadeGudang.findAll({
      where: {
        barang_handmade_id: paginatedIds,
        is_deleted: false
      },
      include: [
        {
          model: KategoriBarangGudang,
          as: "kategori",
          where: { is_deleted: false },
          attributes: ["nama_kategori_barang"]
        },
        {
          model: StokBarangGudang,
          as: "stok_barang",
          attributes: ["jumlah_stok"]
        },
        {
          model: RincianBahanGudang,
          as: "rincian_bahan",
          where: { is_deleted: false },
          attributes: ["barang_mentah_id", "harga_satuan", "kuantitas", "total_biaya"],
          include: [
            {
              model: BarangMentah,
              as: "barang_mentah",
              attributes: ["image", "nama_barang"]
            }
          ]
        }
      ],
      order: [["createdAt", "DESC"]]
    });

    return {
      totalItems,
      data: rows,
      currentPage: parseInt(page),
      totalPages
    };
  }


  static async getById(id) {
    return await BarangHandmadeGudang.findOne({
      where: {
        barang_handmade_id: id,
        is_deleted: false
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
          model: RincianBahanGudang,
          as: 'rincian_bahan',
          where: {
            is_deleted: false
          },
          attributes: ["barang_mentah_id", "harga_satuan", "kuantitas", "total_biaya"],
          include: [
            {
              model: BarangMentah,
              as: 'barang_mentah',
              attributes: ["image", "nama_barang"]
            }
          ]
        }
      ]
    });
  }

  static async update(id, data, options = {}) {
    const transaction = await sequelize.transaction();

    try {
      const {
        image,
        kategori_barang_id,
        nama_barang,
        jumlah_minimum_stok,
        rincian_bahan,
        ...otherData
      } = data;

      const barangHandmadeGudang = await BarangHandmadeGudang.findOne({
        where: {
          barang_handmade_id: id,
          is_deleted: false
        }
      });

      if (!barangHandmadeGudang) return null;

      await barangHandmadeGudang.update({
        image,
        kategori_barang_id,
        nama_barang,
        jumlah_minimum_stok,
        ...otherData
      }, { transaction });

      if (rincian_bahan && Array.isArray(rincian_bahan)) {
        await RincianBahanGudangService.deleteByBarangId(id, { transaction });

        const rincianBahanToCreate = rincian_bahan.map((bahan) => ({
          barang_handmade_id: id,
          barang_mentah_id: bahan.barang_mentah_id,
          harga_satuan: bahan.harga_satuan,
          kuantitas: bahan.kuantitas,
          total_biaya: bahan.total_biaya,
          is_deleted: false
        }));

        await RincianBahanGudangService.createMany(rincianBahanToCreate, { transaction });
      }

      await transaction.commit();

      const updatedBarangHandmadeGudang = await this.getById(id);
      return updatedBarangHandmadeGudang;
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  static async delete(id) {
    const transaction = await sequelize.transaction();
    try {
      await RincianBahanGudangService.deleteByBarangId(id, { transaction });
      await RincianBiayaGudangService.deleteByBarangId(id, { transaction });
      const barangHandmadeGudang = await BarangHandmadeGudang.findByPk(id);
      if (!barangHandmadeGudang) {
        await transaction.rollback();
        return null;
      }
      await barangHandmadeGudang.update({ is_deleted: true }, { transaction });
      await transaction.commit();
      return true;
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  static async createWithDetails(barangData, rincianBahan) {
    const transaction = await sequelize.transaction();

    try {
      const barangHandmadeGudang = await BarangHandmadeGudang.create(barangData, { transaction });

      const rincianBahanToCreate = rincianBahan.map((bahan) => ({
        barang_handmade_id: barangHandmadeGudang.barang_handmade_id,
        barang_mentah_id: bahan.barang_mentah_id,
        harga_satuan: bahan.harga_satuan,
        kuantitas: bahan.kuantitas,
        total_biaya: bahan.total_biaya,
        is_deleted: false
      }));

      const createdRincianBahan = await RincianBahanGudangService.createMany(
        rincianBahanToCreate,
        { transaction }
      );

      await transaction.commit();

      return {
        barangHandmade: barangHandmadeGudang,
        rincian_bahan: createdRincianBahan
      };
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }
}

module.exports = BarangHandmadeGudangService;
