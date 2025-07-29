const Packaging = require("../models/packaging");
const JenisBarang = require("../models/jenisBarang");
const KategoriBarang = require("../models/kategoriBarang");
const StokBarang = require("../models/stokBarang");
const { Op } = require("sequelize");

class PackagingService {
  static async create(data) {
    return await Packaging.create(data);
  }

  static async getAll(toko_id, page = 1, limit = 10, search = "", category) {
    const offset = (page - 1) * limit;

    const whereConditions = {
      is_deleted: false
    };

    if (category) {
      whereConditions.kategori_barang_id = category;
    }

    if (search) {
      whereConditions.nama_packaging = { [Op.like]: `%${search}%` };
    }

    if (toko_id) {
      whereConditions.toko_id = toko_id;
    }

    // 1. Fetch all matching IDs
    const matchingItems = await Packaging.findAll({
      where: whereConditions,
      attributes: ["packaging_id"],
      raw: true
    });

    const allIds = [...new Set(matchingItems.map(item => item.packaging_id))];
    const totalItems = allIds.length;
    const totalPages = Math.ceil(totalItems / limit);
    const paginatedIds = allIds.slice(offset, offset + limit);

    // 2. Fetch paginated full data
    const rows = await Packaging.findAll({
      where: {
        packaging_id: paginatedIds,
        is_deleted: false
      },
      include: [
        {
          model: JenisBarang,
          as: "jenis_barang",
          attributes: ["jenis_barang_id", "nama_jenis_barang"]
        },
        {
          model: StokBarang,
          as: "stok_barang",
          attributes: ["jumlah_stok"]
        },
        {
          model: KategoriBarang,
          as: "kategori_barang",
          attributes: ["kategori_barang_id", "nama_kategori_barang"]
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
    return await Packaging.findOne({
      where: {
        packaging_id: id,
        is_deleted: false
      },
      include: [
        {
          model: JenisBarang,
          as: "jenis_barang",
          attributes: ["jenis_barang_id", "nama_jenis_barang"]
        },
        {
          model: KategoriBarang,
          as: "kategori_barang",
          attributes: ["kategori_barang_id", "nama_kategori_barang"]
        },
        {
          model: StokBarang,
          as: "stok_barang",
          attributes: ["jumlah_stok"]
        },
      ]
    });
  }

  static async update(id, data) {
    const packaging = await Packaging.findByPk(id);
    if (!packaging) return null;

    Object.assign(packaging, data);
    await packaging.save();

    return packaging;
  }

  static async delete(id) {
    const packaging = await Packaging.findByPk(id);
    if (!packaging) return null;
    await packaging.destroy();
    return true;
  }
}

module.exports = PackagingService;  
