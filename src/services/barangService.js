const Barang = require("../models/barang");
const JenisBarang = require("../models/jenisBarang");
const KategoriBarang = require("../models/kategoriBarang");

class BarangService {
  static async create(data) {
    return await Barang.create(data);
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

  static async getAllByJenis(id){
    return await Barang.findAll({
      where: {
        is_deleted: false,
        jenis_barang_id: id
      },
      include: [
        {
          model: KategoriBarang,
          as: "kategori",
          attributes: ["nama_kategori_barang"]
        }
      ]
    })
  }

  static async getAllByKategori(id) {
    return await Barang.findAll({
      where: {
        is_deleted: false,
        kategori_barang_id: id
      },
      include: [
        {
          model: JenisBarang,
          as: "jenis",
          attributes: ["nama_jenis_barang"]
        }
      ]
    })
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
