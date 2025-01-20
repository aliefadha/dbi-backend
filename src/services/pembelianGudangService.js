const BarangMentah = require("../models/barangMentah");
const BarangNonHandmadeGudang = require("../models/barangNonHandmadeGudang");
const JenisBarangGudang = require("../models/jenisBarangGudang");
const KategoriBarangGudang = require("../models/kategoriBarangGudang");
const MetodePembayaranGudang = require("../models/metodePembayaranGudang");
const PackagingGudang = require("../models/packagingGudang");
const PembelianGudang = require("../models/pembelianGudang");  
const ProdukPembelianGudang = require("../models/produkPembelianGudang");
  
class PembelianGudangService {  
  static async create(data) {  
    return await PembelianGudang.create(data); 
     
  }  
  
  static async getAll() {  
    return await PembelianGudang.findAll({
      where: {
        is_deleted: false
      },
    });  
  }  
  
  static async getById(id) {  
    return await PembelianGudang.findOne({
      where: {
        pembelian_id: id,
        is_deleted: false
      },
      include: [
        {
          model: MetodePembayaranGudang,
          as: "metode_pembelian",
          attributes: ["nama_metode"]
        },
        {
          model: ProdukPembelianGudang,
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
    const pembelianGudang = await PembelianGudang.findByPk(id);  
    if (!pembelianGudang) return null;  
  
    Object.assign(pembelianGudang, data);  
    await pembelianGudang.save();  
  
    return pembelianGudang;  
  }  
  
  static async delete(id) {  
    const pembelianGudang = await PembelianGudang.findByPk(id);  
    if (!pembelianGudang) return null;  
    await pembelianGudang.update({ is_deleted: true });  
    return true;  
  }  
}  
  
module.exports = PembelianGudangService;  
