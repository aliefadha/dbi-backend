const BarangMentah = require("../models/barangMentah");
const BarangNonHandmadeGudang = require("../models/barangNonHandmadeGudang");  
const JenisBarangGudang = require("../models/jenisBarangGudang");
const KategoriBarangGudang = require("../models/kategoriBarangGudang");
const RincianBahanGudang = require("../models/rincianBahanGudang");
const RincianBiayaGudang = require("../models/rincianBiayaGudang");
  
class BarangNonHandmadeGudangService {  
  static async create(data) {  
    return await BarangNonHandmadeGudang.create(data);  
  }  
  
  static async getAll() {  
    return await BarangNonHandmadeGudang.findAll({
      where: {
        is_deleted: false
      },
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
        },
        {
          model: RincianBiayaGudang,
          as: "rincian_biaya",
          attributes: ["nama_biaya", "jumlah_biaya", "is_deleted"]
        },
        {
          model: RincianBahanGudang,
          as: "rincian_bahan",
          attributes: ["barang_mentah_id", "harga_satuan", "kuantitas", "total_biaya", "is_deleted"],
          include: [
            {
              model: BarangMentah,
              as: "barang_mentah",
              attributes: ["image", "nama_barang", "is_deleted"],
            }
          ]
        }
      ]
    });  
  }  
  
  static async getById(id) {  
    return await BarangNonHandmadeGudang.findOne({
      where: {
        barang_id: id,
        is_deleted: false,
      },
      include: [
        {
          model: KategoriBarangGudang,
          as: "kategori",
          attributes: ["nama_kategori_barang"]
        },
        {
          model: JenisBarangGudang,
          as: "jenis",
          attributes: ["nama_jenis_barang"]
        }
      ]
    });  
  }  
  
  static async update(id, data) {  
    const barangNonHandmadeGudang = await BarangNonHandmadeGudang.findByPk(id);  
    if (!barangNonHandmadeGudang) return null;  
  
    Object.assign(barangNonHandmadeGudang, data);  
    await barangNonHandmadeGudang.save();  
  
    return barangNonHandmadeGudang;  
  }  
  
  static async delete(id) {  
    const barangNonHandmadeGudang = await BarangNonHandmadeGudang.findByPk(id);  
    if (!barangNonHandmadeGudang) return null;  
    await barangNonHandmadeGudang.update({ is_deleted: true });  
    return true;  
  }  
}  
  
module.exports = BarangNonHandmadeGudangService;  
