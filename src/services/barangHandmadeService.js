const BarangHandmade = require("../models/barangHandmade");  
const RincianBiaya = require("../models/rincianBiaya");
const DetailRincianBiaya = require("../models/detailRincianBiaya");
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
  
  static async getAll() {  
    return await BarangHandmade.findAll({
      where: {
        is_deleted: false
      }
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
          model: RincianBiaya,
          as: "rincian_biaya",
          include: [
            {
              model: DetailRincianBiaya,
              as: "detail_rincian_biaya"
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
    await barangHandmade.update({ is_deleted: true });  
    return true;  
  }  
}  
  
module.exports = BarangHandmadeService;  
