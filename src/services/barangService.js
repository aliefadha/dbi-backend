const Barang = require("../models/barang");
const JenisBarang = require("../models/jenisBarang");
const KategoriBarang = require("../models/kategoriBarang");

class BarangService {
  static async create(data) {
    return await Barang.create(data);
  }

  static async createHandmade(data) {
    const handmadeData = {
      ...data,
      jenis_barang_id: 1
    };
    return await Barang.create(handmadeData);
  }

  static async createNonHandmade(data) {
    const handmadeData = {
      ...data,
      jenis_barang_id: 2
    };
    return await Barang.create(handmadeData);
  }

  static async createCustom(data) {
    const handmadeData = {
      ...data,
      jenis_barang_id: 3
    };
    return await Barang.create(handmadeData);
  }

  static async getAll() {
    return await Barang.findAll({
      where: { is_deleted: false },
      include: [
        {
          model: JenisBarang,
          as: "jenis",
          attributes: ["nama_jenis_barang"]
        },
        {
          model: KategoriBarang,
          as: "kategori",
          attributes: ["nama_kategori_barang"]
        }
      ],
    });
  }

  static async getById(id) {
    return await Barang.findOne({
      where: {
        barang_id: id,
        is_deleted: false
      },
      include: [
        {
          model: JenisBarang,
          as: "jenis",
          attributes: ["nama_jenis_barang"]
        },
        {
          model: KategoriBarang,
          as: "kategori",
          attributes: ["nama_kategori_barang"]
        }
      ],
    });
  }

  static async update(id, data) {
    const barang = await Barang.findOne({
      where: {
        barang_id: id,
        is_deleted: false
      }
    });
    if (!barang) return null;

    Object.assign(barang, data);
    await barang.save();

    return barang;
  }

  static async delete(id) {
    const barang = await Barang.findByPk(id);
    if (!barang) return null;
    await barang.update({ is_deleted: true });
    return true;
  }
}

module.exports = BarangService;  
