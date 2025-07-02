const BarangNonHandmade = require("../models/barangNonHandmade");
const RincianBiaya = require("../models/rincianBiaya");
const DetailRincianBiaya = require("../models/detailRincianBiaya");
const KategoriBarang = require("../models/kategoriBarang");
const JenisBarang = require("../models/jenisBarang");
const Cabang = require("../models/cabang");
const Toko = require("../models/toko");
const StokBarang = require("../models/stokBarang");
const { Op } = require("sequelize");

class BarangNonHandmadeService {
  static async create(data) {
    const { image, barang_non_handmade_id, jenis_barang_id, kategori_barang_id, nama_barang, jumlah_minimum_stok, rincian_biaya } = data;

    const barangNonHandmade = await BarangNonHandmade.create({
      image,
      barang_non_handmade_id,
      jenis_barang_id,
      kategori_barang_id,
      nama_barang,
      jumlah_minimum_stok
    });

    for (const rincian of rincian_biaya) {
      const { cabang_id, detail_rincian_biaya, total_hpp, keuntungan, harga_jual, harga_jual_ideal, margin_persentase, margin_nominal, harga_logis } = rincian;

      const rincianBiaya = await RincianBiaya.create({
        barang_non_handmade_id: barangNonHandmade.barang_non_handmade_id,
        cabang_id,
        total_hpp,
        keuntungan,
        harga_jual,
        harga_jual_ideal,
        margin_persentase,
        margin_nominal,
        harga_logis
      });

      for (const detail of detail_rincian_biaya) {
        await DetailRincianBiaya.create({
          rincian_biaya_id: rincianBiaya.rincian_biaya_id,
          nama_biaya: detail.nama_biaya,
          jumlah_biaya: detail.jumlah_biaya
        });
      }
    }

    return barangNonHandmade;
  }

  static async getAll(toko_id, cabang_id, page = 1, limit = 10, search = "") {
    const offset = (page - 1) * limit;
    
    const whereConditionsBarangNonHandmade = {
      is_deleted: false
    }

    const whereConditionsToko = {
      is_deleted: false
    }

    const whereConditionsCabang = {
      is_deleted: false
    }

    if (search) {
      whereConditionsBarangNonHandmade.nama_barang = { [Op.like]: `%${search}%` };
    }

    if (toko_id) {
      whereConditionsToko.toko_id = toko_id;
    }

    if (cabang_id) {
      whereConditionsCabang.cabang_id = cabang_id;
    }
    const { count, rows } = await BarangNonHandmade.findAndCountAll({
      where: whereConditionsBarangNonHandmade,
      include: [
        {
          model: KategoriBarang,
          as: "kategori",
          attributes: ["nama_kategori_barang"]
        },
        {
          model: JenisBarang,
          as: "jenis",
          attributes: ["nama_jenis_barang"]
        },
        {
          model: StokBarang,
          as: "stok_barang",
          attributes: ["jumlah_stok"]
        },
        {
          model: RincianBiaya,
          as: "rincian_biaya",
          required: true,
          where: {
            is_deleted: false
          },
          include: [
            {
              model: Cabang,
              as: "cabang",
              attributes: ["cabang_id", "nama_cabang"],
              required: true,
              where: whereConditionsCabang,
              include: [
                {
                  model: Toko,
                  as: "toko",
                  attributes: ["toko_id", "nama_toko"],
                  required: true,
                  where: whereConditionsToko
                }
              ]
            },
            {
              model: DetailRincianBiaya,
              as: "detail_rincian_biaya",
              where: {
                biaya_toko_id: null
              },
              attributes: {
                exclude: ["biaya_toko_id"]
              }
            },
          ]
        }
      ],
      order: [["createdAt", "DESC"]],
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
    return await BarangNonHandmade.findOne({
      where: {
        barang_non_handmade_id: id,
        is_deleted: false
      },
      include: [
        {
          model: KategoriBarang,
          as: "kategori",
        },
        {
          model: JenisBarang,
          as: "jenis",
        },
        {
          model: StokBarang,
          as: "stok_barang",
          attributes: ["jumlah_stok"]
        },
        {
          model: RincianBiaya,
          as: "rincian_biaya",
          include: [
            {
              model: Cabang,
              as: "cabang",
              attributes: ["nama_cabang"]
            },
            {
              model: DetailRincianBiaya,
              as: "detail_rincian_biaya",
              where: {
                biaya_toko_id: null
              },
              attributes: {
                exclude: ["biaya_toko_id"]
              }
            },
          ]
        }
      ]
    });
  }

  static async update(id, data) {
    const { image, jenis_barang_id, kategori_barang_id, nama_barang, jumlah_minimum_stok, rincian_biaya } = data;

    const barangNonHandmade = await BarangNonHandmade.findOne({
      where: {
        barang_non_handmade_id: id,
        is_deleted: false
      }
    });

    if (!barangNonHandmade) return null;

    await barangNonHandmade.update({
      image,
      jenis_barang_id,
      kategori_barang_id,
      nama_barang,
      jumlah_minimum_stok
    });

    for (const rincian of rincian_biaya) {
      if (!rincian || !rincian.detail_rincian_biaya) {
        throw new Error('Invalid rincian_biaya data structure');
      }

      const { cabang_id, detail_rincian_biaya, total_hpp, keuntungan, harga_jual, harga_jual_ideal, margin_persentase, margin_nominal, harga_logis } = rincian;

      let rincianBiaya = await RincianBiaya.findOne({
        where: {
          barang_non_handmade_id: barangNonHandmade.barang_non_handmade_id,
          cabang_id: cabang_id
        }
      });

      if (!rincianBiaya) {
        rincianBiaya = await RincianBiaya.create({
          barang_non_handmade_id: barangNonHandmade.barang_non_handmade_id,
          cabang_id,
          total_hpp,
          keuntungan,
          harga_jual,
          harga_jual_ideal,
          margin_persentase,
          margin_nominal,
          harga_logis
        });
      } else {
        await rincianBiaya.update({
          total_hpp,
          keuntungan,
          harga_jual,
          harga_jual_ideal,
          margin_persentase,
          margin_nominal,
          harga_logis
        });
      }

      await DetailRincianBiaya.destroy({
        where: {
          rincian_biaya_id: rincianBiaya.rincian_biaya_id
        }
      });

      for (const detail of detail_rincian_biaya) {
        if (!detail || typeof detail.nama_biaya === 'undefined' || typeof detail.jumlah_biaya === 'undefined') {
          throw new Error('Invalid detail_rincian_biaya data structure');
        }

        await DetailRincianBiaya.create({
          rincian_biaya_id: rincianBiaya.rincian_biaya_id,
          nama_biaya: detail.nama_biaya,
          jumlah_biaya: detail.jumlah_biaya
        });
      }
    }

    return barangNonHandmade;
  }

  static async delete(id) {
    const barangNonHandmade = await BarangNonHandmade.findByPk(id);
    if (!barangNonHandmade) return null;
    await barangNonHandmade.destroy();
    return true;
  }
}

module.exports = BarangNonHandmadeService;  
