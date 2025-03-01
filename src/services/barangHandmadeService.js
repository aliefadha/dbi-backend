const BarangHandmade = require("../models/barangHandmade");  
const RincianBiaya = require("../models/rincianBiaya");
const DetailRincianBiaya = require("../models/detailRincianBiaya");
const KategoriBarang = require("../models/kategoriBarang");
const JenisBarang = require("../models/jenisBarang");
const BiayaToko = require("../models/biayaToko");
const Cabang = require("../models/cabang");
const Toko = require("../models/toko");
const { Op } = require("sequelize");
class BarangHandmadeService {  
  static async create(data) {  
    const { image, barang_handmade_id, jenis_barang_id, kategori_barang_id, nama_barang, jumlah_minimum_stok, rincian_biaya } = data;

    const barangHandmade = await BarangHandmade.create({
      image,
      barang_handmade_id,
      jenis_barang_id,
      kategori_barang_id,
      nama_barang,
      jumlah_minimum_stok
    });
    for (const rincian of rincian_biaya) {
      const { cabang_id, detail_rincian_biaya, total_hpp, keuntungan, harga_jual} = rincian;

      const rincianBiaya = await RincianBiaya.create({
        barang_handmade_id: barangHandmade.barang_handmade_id,
        cabang_id,
        total_hpp,
        keuntungan,
        harga_jual
      });

      for (const detail of detail_rincian_biaya) {
        await DetailRincianBiaya.create({
          rincian_biaya_id: rincianBiaya.rincian_biaya_id,
          biaya_toko_id: detail.biaya_toko_id,
          nama_biaya: detail.nama_biaya,
          jumlah_biaya: detail.jumlah_biaya
        });
      }
    }

    return barangHandmade;
  }  
  
  static async getAll(toko_id, cabang_id) {
    const whereConditionsToko = {
      is_deleted: false
    }

    const whereConditionsCabang = {
      is_deleted: false
    }

    if (toko_id) {
      whereConditionsToko.toko_id = toko_id;
    }

    if (cabang_id) {
      whereConditionsCabang.cabang_id = cabang_id;
    }
    return await BarangHandmade.findAll({
      where: {
        is_deleted: false
      },
      include: [
        {
          model: KategoriBarang,
          as: "kategori_barang",
          attributes: ["nama_kategori_barang"]
        },
        {
          model: JenisBarang,
          as: "jenis_barang",
          attributes: ["nama_jenis_barang"]
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
              as: "detail_rincian_biaya"
            }
          ]
        }
      ],
      order: [["created_at", "DESC"]]
    });
  }
  
  
  static async getById(id) {  
    return await BarangHandmade.findOne({
      where: {
        barang_handmade_id: id,
        is_deleted: false
      },
      include: [
        {
          model: KategoriBarang,
          as: "kategori_barang",
        },
        {
          model: JenisBarang,
          as: "jenis_barang",
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
              include: [
                {
                  model: BiayaToko,
                  as: "biaya_toko"
                }
              ]
            }
          ]
        }
      ]
    });  
  }  
  
  static async update(id, data) {  
    const { image, jenis_barang_id, kategori_barang_id, nama_barang, jumlah_minimum_stok, rincian_biaya } = data;

    const barangHandmade = await BarangHandmade.findOne({
      where: {
        barang_handmade_id: id,
        is_deleted: false
      }
    });

    if (!barangHandmade) return null;

    await barangHandmade.update({
      image,
      jenis_barang_id,
      kategori_barang_id,
      nama_barang,
      jumlah_minimum_stok
    });

    for (const rincian of rincian_biaya) {
      const { cabang_id, detail_rincian_biaya, total_hpp, keuntungan, harga_jual} = rincian;

      let rincianBiaya = await RincianBiaya.findOne({ 
        where: {
          barang_handmade_id: barangHandmade.barang_handmade_id,
          cabang_id: cabang_id
        }
      });

      if (!rincianBiaya) {
        rincianBiaya = await RincianBiaya.create({
          barang_handmade_id: barangHandmade.barang_handmade_id,
          cabang_id,
          total_hpp,
          keuntungan,
          harga_jual
        });
      } else {
        await rincianBiaya.update({
          total_hpp,  
          keuntungan,
          harga_jual
        });
      }

      await DetailRincianBiaya.destroy({
        where: {
          rincian_biaya_id: rincianBiaya.rincian_biaya_id
        }
      });

      for (const detail of detail_rincian_biaya) {
        await DetailRincianBiaya.create({
          rincian_biaya_id: rincianBiaya.rincian_biaya_id,
          biaya_toko_id: detail.biaya_toko_id,
          nama_biaya: detail.nama_biaya,
          jumlah_biaya: detail.jumlah_biaya
        });
      }
    }

    return barangHandmade;
  }  
  
  static async delete(id) {  
    const barangHandmade = await BarangHandmade.findByPk(id);  
    if (!barangHandmade) return null;  
    await barangHandmade.destroy();  
    return true;  
  }  
}  
  
module.exports = BarangHandmadeService;  
