const BarangNonHandmadeGudang = require("../models/barangNonHandmadeGudang");
const KategoriBarangGudang = require("../models/kategoriBarangGudang");

class KategoriBarangGudangService {
  static async create(data) {
    return await KategoriBarangGudang.create(data);
  }

  static async getAll() {
    return await KategoriBarangGudang.findAll({
      where: {
        is_deleted: false
      },
      order: [["createdAt", "DESC"]]
    });
  }

  static async getById(id) {
    return await KategoriBarangGudang.findOne({
      where: {
        kategori_barang_id: id,
        is_deleted: false
      },
      include: [
        {
          model: BarangNonHandmadeGudang,
          as: "barang"
        }
      ]
    });
  }

  static async update(id, data) {
    const kategoriBarangGudang = await KategoriBarangGudang.findByPk(id);
    if (!kategoriBarangGudang) return null;

    Object.assign(kategoriBarangGudang, data);
    await kategoriBarangGudang.save();

    return kategoriBarangGudang;
  }

  static async delete(id) {
    const kategoriBarangGudang = await KategoriBarangGudang.findByPk(id);
    if (!kategoriBarangGudang) return null;
    await kategoriBarangGudang.update({ is_deleted: true });
    return true;
  }
}

module.exports = KategoriBarangGudangService;  
