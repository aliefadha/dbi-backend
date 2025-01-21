const BarangMentah = require("../models/barangMentah");
const BarangNonHandmadeGudang = require("../models/barangNonHandmadeGudang");
const JenisBarangGudang = require("../models/jenisBarangGudang");
const KategoriBarangGudang = require("../models/kategoriBarangGudang");
const MetodePembayaranGudang = require("../models/metodePembayaranGudang");
const PackagingGudang = require("../models/packagingGudang");
const PenjualanGudang = require("../models/penjualanGudang");
const ProdukPenjualanGudang = require("../models/produkPenjualanGudang");

class PenjualanGudangService {
  static async create(data) {
    return await PenjualanGudang.create(data);
  }

  static async getAll() {
    return await PenjualanGudang.findAll({
      where: {
        is_deleted: false
      },
      include: [
        {
          model: MetodePembayaranGudang,
          as: "metode_pembayaran",
          attributes: ["nama_metode"]
        },
        {
          model: ProdukPenjualanGudang,
          as: "produk",
          include: [
            {
              model: BarangNonHandmadeGudang,
              as: "barang_nonhandmade",
              attributes: ["image", "nama_barang", "kategori_barang_id", "jenis_barang_id", "harga_jual", "is_deleted"],
              include: [
                {
                  model: KategoriBarangGudang,
                  as: "kategori",
                  attributes: ["nama_kategori_barang", "is_deleted"]
                },
                {
                  model: JenisBarangGudang,
                  as: "jenis",
                  attributes: ["nama_jenis_barang", "is_deleted"]
                }
              ]
            },
            {
              model: BarangMentah,
              as: "barang_mentah",
              attributes: ["image", "nama_barang", "harga_satuan", "is_deleted"],
            },
            {
              model: PackagingGudang,
              as: "packaging",
              attributes: ["image", "nama_packaging", "ukuran", "harga_satuan"]
            },
          ]
        }
      ]
    });
  }

  static async getById(id) {
    return await PenjualanGudang.findOne({
      where: {
        penjualan_id: id,
        is_deleted: false
      },
      include: [
        {
          model: MetodePembayaranGudang,
          as: "metode_pembayaran",
          attributes: ["nama_metode"]
        },
        {
          model: ProdukPenjualanGudang,
          as: "produk",
          include: [
            {
              model: BarangNonHandmadeGudang,
              as: "barang_nonhandmade",
              attributes: ["image", "nama_barang", "kategori_barang_id", "jenis_barang_id", "harga_jual", "is_deleted"],
              include: [
                {
                  model: KategoriBarangGudang,
                  as: "kategori",
                  attributes: ["nama_kategori_barang", "is_deleted"]
                },
                {
                  model: JenisBarangGudang,
                  as: "jenis",
                  attributes: ["nama_jenis_barang", "is_deleted"]
                }
              ]
            },
            {
              model: BarangMentah,
              as: "barang_mentah",
              attributes: ["image", "nama_barang", "harga_satuan", "is_deleted"],
            },
            {
              model: PackagingGudang,
              as: "packaging",
              attributes: ["image", "nama_packaging", "ukuran", "harga_satuan"]
            },
          ]
        }
      ]
    });
  }

  static async update(id, data) {
    const penjualanGudang = await PenjualanGudang.findByPk(id);
    if (!penjualanGudang) return null;

    Object.assign(penjualanGudang, data);
    await penjualanGudang.save();

    return penjualanGudang;
  }

  static async delete(id) {
    const penjualanGudang = await PenjualanGudang.findByPk(id);
    if (!penjualanGudang) return null;
    await penjualanGudang.update({ is_deleted: true });
    return true;
  }
}

module.exports = PenjualanGudangService;  
