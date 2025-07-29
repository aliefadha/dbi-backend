const { Op } = require("sequelize");
const PackagingGudang = require("../models/packagingGudang");
const StokBarangGudang = require("../models/stokBarangGudang");
const CustomIdGenerateService = require("./customIdGenerateService");

class PackagingGudangService {
  static async create(data) {
    return await PackagingGudang.create(data);
  }

  static async getAll(page = 1, limit = 10, search = "") {
    const offset = (page - 1) * limit;

    const whereConditions = {
      is_deleted: false
    };

    if (search) {
      whereConditions.nama_packaging = { [Op.like]: `%${search}%` };
    }

    // 1. Fetch matching IDs (avoid JOIN impact)
    const matchingItems = await PackagingGudang.findAll({
      where: whereConditions,
      attributes: ["packaging_id"],
      raw: true
    });

    const allIds = [...new Set(matchingItems.map(item => item.packaging_id))];
    const totalItems = allIds.length;
    const totalPages = Math.ceil(totalItems / limit);
    const paginatedIds = allIds.slice(offset, offset + limit);

    // 2. Fetch full data for paginated IDs
    const rows = await PackagingGudang.findAll({
      where: {
        packaging_id: paginatedIds,
        is_deleted: false
      },
      include: [
        {
          model: StokBarangGudang,
          as: "stok_barang",
          attributes: ["jumlah_stok"]
        }
      ],
      order: [["nama_packaging", "ASC"]]
    });

    return {
      totalItems,
      data: rows,
      currentPage: parseInt(page),
      totalPages
    };
  }

  static async getById(id) {
    return await PackagingGudang.findOne({
      where: {
        packaging_id: id,
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
    const packagingGudang = await PackagingGudang.findByPk(id);
    if (!packagingGudang) return null;

    Object.assign(packagingGudang, data);
    await packagingGudang.save();

    return packagingGudang;
  }

  static async delete(id) {
    const packagingGudang = await PackagingGudang.findByPk(id);
    if (!packagingGudang) return null;
    await packagingGudang.destroy();
    return true;
  }
}

module.exports = PackagingGudangService;  
