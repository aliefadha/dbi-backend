const BarangNonHandmade = require("../models/barangNonHandmade");
const Cabang = require("../models/cabang");
const Pembelian = require("../models/pembelian");
const ProdukPembelian = require("../models/produkPembelian");

class PembelianService {
  static async create(data) {
    return await Pembelian.create(data);
  }

  static async getAll() {
    return await Pembelian.findAll({
      include: [
        {
          model: ProdukPembelian,
          as: "produk",
          attributes: ["barang_id", "kuantitas"],
          include: [
            {
              model: Cabang,
              as: "cabang",
              attributes: ["cabang_id", "nama_cabang"],
            },
          ],
        },
        {
          model: MetodePembayaran,
          attributes: ['nama_metode'],
          as: 'metode'
        },
      ],
    });
  }

  static async getById(id) {
    return await Pembelian.findByPk(id, {
      include: [
        {
          model: ProdukPembelian,
          as: "produk",
          include: [
            {
              model: BarangNonHandmade,
              as: "barang",
              attributes: ["barang_id", "nama_barang", "harga_jual"]
            },
            {
              model: Cabang,
              as: "cabang",
              attributes: ["cabang_id", "nama_cabang"]
            }
          ],
          attributes: ["barang_id", "cabang_id", "kuantitas"]
        },
      ],
    });
  }

  static async update(id, data) {
    const pembelian = await Pembelian.findByPk(id);
    if (!pembelian) return null;

    Object.assign(pembelian, data);
    await pembelian.save();

    return pembelian;
  }

  static async delete(id) {
    const pembelian = await Pembelian.findByPk(id);
    if (!pembelian) return null;
    await pembelian.destroy();
    return true;
  }

}

module.exports = PembelianService;  
