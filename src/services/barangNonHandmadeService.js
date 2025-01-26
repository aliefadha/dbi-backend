const BarangNonHandmade = require("../models/barangNonHandmade");  
const RincianBiaya = require("../models/rincianBiaya");
const DetailRincianBiaya = require("../models/detailRincianBiaya");
const KategoriBarang = require("../models/kategoriBarang");
const JenisBarang = require("../models/jenisBarang");
const Cabang = require("../models/cabang");
const BiayaToko = require("../models/biayaToko");
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
      const { cabang_id, detail_rincian_biaya, total_hpp, keuntungan, harga_jual} = rincian;

      const rincianBiaya = await RincianBiaya.create({
        barang_non_handmade_id: barangNonHandmade.barang_non_handmade_id,
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

    return barangNonHandmade;
  }  
  
  static async getAll() {  
    return await BarangNonHandmade.findAll({
      where: {
        is_deleted: false
      },
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
              as: "detail_rincian_biaya"
            }
          ]
        }
      ]
    });  
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
          attributes: ["nama_kategori_barang"]
        },
        {
          model: JenisBarang,
          as: "jenis",
          attributes: ["nama_jenis_barang"]
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
    const { image, barang_non_handmade_id, jenis_barang_id, kategori_barang_id, nama_barang, jumlah_minimum_stok, rincian_biaya } = data;

    const barangNonHandmade = await BarangNonHandmade.findOne({
      where: {
        barang_non_handmade_id: id,
        is_deleted: false
      }
    });  
    if (!barangNonHandmade) return null;

    await barangNonHandmade.update({
      image,
      barang_non_handmade_id,
      jenis_barang_id,
      kategori_barang_id,
      nama_barang,
      jumlah_minimum_stok
    });

    for (const rincian of rincian_biaya) {
      const { cabang_id, detail_rincian_biaya, total_hpp, keuntungan, harga_jual} = rincian;

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

    return barangNonHandmade;
  }  
  
  static async delete(id) {  
    const barangNonHandmade = await BarangNonHandmade.findByPk(id);  
    if (!barangNonHandmade) return null;  
    await barangNonHandmade.update({ is_deleted: true });  
    return true;  
  }  
}  
  
module.exports = BarangNonHandmadeService;  
