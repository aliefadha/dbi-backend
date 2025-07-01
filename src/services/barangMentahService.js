const BarangMentah = require("../models/barangMentah");
const StokBarangGudang = require("../models/stokBarangGudang");

class BarangMentahService {
  static async create(data) {
    return await BarangMentah.create(data);
  }

  static async getAll(page = 1, limit = 1) {
    const offset = (page - 1) * limit;

    const { rows, count } = await BarangMentah.findAndCountAll({
      where: {
        is_deleted: false
      },
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
