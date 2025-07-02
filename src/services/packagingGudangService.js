const { Op } = require("sequelize");
const PackagingGudang = require("../models/packagingGudang");
const StokBarangGudang = require("../models/stokBarangGudang");
const CustomIdGenerateService = require("./customIdGenerateService");

class PackagingGudangService {
  static async create(data) {
    return await PackagingGudang.create(data);
  }

  static async getAll(page = 1, limit = 1, search = "") {
    const offset = (page - 1) * limit;

    const whereConditions = {
      is_deleted: false
    }

    if (search) {
      whereConditions.nama_packaging = { [Op.like]: `%${search}%` };
    }

    const { rows, count } = await PackagingGudang.findAndCountAll({
      where: whereConditions,
      include: [
        {
          model: StokBarangGudang,
          as: "stok_barang",
          attributes: ["jumlah_stok"]
        },
      ],
      order: [['createdAt', 'DESC']],
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
