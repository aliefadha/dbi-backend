const { Op } = require("sequelize");
const BarangMentah = require("../models/barangMentah");
const StokBarangGudang = require("../models/stokBarangGudang");

class BarangMentahService {
  static async create(data) {
    return await BarangMentah.create(data);
  }

  static async getAll(page = 1, limit = 10, search = "") {
    const offset = (page - 1) * limit;

    const whereConditions = {
      is_deleted: false
    };

    if (search) {
      whereConditions.nama_barang = { [Op.like]: `%${search}%` };
    }

    // 1. Fetch all matching IDs
    const matchingItems = await BarangMentah.findAll({
      where: whereConditions,
      attributes: ["barang_mentah_id"],
      raw: true
    });

    const allIds = [...new Set(matchingItems.map(item => item.barang_mentah_id))];
    const totalItems = allIds.length;
    const totalPages = Math.ceil(totalItems / limit);
    const paginatedIds = allIds.slice(offset, offset + limit);

    // 2. Fetch paginated full data
    const rows = await BarangMentah.findAll({
      where: {
        barang_mentah_id: paginatedIds,
        is_deleted: false
      },
      include: [
        {
          model: StokBarangGudang,
          as: "stok_barang",
          attributes: ["jumlah_stok"]
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
    return await BarangMentah.findOne({
      where: {
        barang_mentah_id: id,
        is_deleted: false
      },
      include: [
        {
          model: StokBarangGudang,
          as: "stok_barang",
          attributes: ["jumlah_stok"]
        },
      ],
    });
  }

  static async update(id, data) {
    const barangMentah = await BarangMentah.findByPk(id);
    if (!barangMentah) return null;

    Object.assign(barangMentah, data);
    await barangMentah.save();

    return barangMentah;
  }

  static async delete(id) {
    const barangMentah = await BarangMentah.findByPk(id);
    if (!barangMentah) return null;
    await barangMentah.destroy();
    return true;
  }
}

module.exports = BarangMentahService;  
