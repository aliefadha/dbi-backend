const { where, Op } = require("sequelize");
const BarangCustom = require("../models/barangCustom");
const JenisBarang = require("../models/jenisBarang");
const KategoriBarang = require("../models/kategoriBarang");
const StokBarang = require("../models/stokBarang");

class BarangCustomService {
  static async create(data) {
    return await BarangCustom.create(data);
  }

  static async getAll(toko_id, page = 1, limit = 10, search = "", category) {
    const offset = (page - 1) * limit;

    const whereConditions = {
      is_deleted: false
    };

    if (search) {
      whereConditions.nama_barang = { [Op.like]: `%${search}%` };
    }

    if (category) {
      whereConditions.kategori_barang_id = category;
    }

    if (toko_id) {
      whereConditions.toko_id = toko_id;
    }

    // 1. Fetch all matching IDs
    const matchingItems = await BarangCustom.findAll({
      where: whereConditions,
      attributes: ["barang_custom_id"],
      raw: true
    });

    const allIds = [...new Set(matchingItems.map(item => item.barang_custom_id))];
    const totalItems = allIds.length;
    const totalPages = Math.ceil(totalItems / limit);
    const paginatedIds = allIds.slice(offset, offset + limit);

    // 2. Fetch paginated full data
    const rows = await BarangCustom.findAll({
      where: {
        barang_custom_id: paginatedIds,
        is_deleted: false
      },
      include: [
        { model: JenisBarang, as: "jenis_barang" },
        { model: KategoriBarang, as: "kategori" },
        { model: StokBarang, as: "stok_barang", attributes: ["jumlah_stok"] }
      ],
      order: [["nama_barang", "ASC"]]
    });

    return {
      totalItems,
      data: rows,
      currentPage: parseInt(page),
      totalPages
    };
  }


  static async getById(id) {
    return await BarangCustom.findOne({
      where: {
        barang_custom_id: id,
        is_deleted: false
      },
      include: [
        { model: JenisBarang, as: "jenis_barang" },
        { model: KategoriBarang, as: "kategori" },
        { model: StokBarang, as: "stok_barang", attributes: ["jumlah_stok"] }
      ]
    });
  }

  static async update(id, data) {
    const barangCustom = await BarangCustom.findByPk(id);
    if (!barangCustom) return null;

    Object.assign(barangCustom, data);
    await barangCustom.save();

    return barangCustom;
  }

  static async delete(id) {
    const barangCustom = await BarangCustom.findByPk(id);
    if (!barangCustom) return null;
    await barangCustom.destroy();
    return true;
  }
}

module.exports = BarangCustomService;  
