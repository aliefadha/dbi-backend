const BarangCustom = require("../models/barangCustom");
const BarangHandmade = require("../models/barangHandmade");
const BarangNonHandmade = require("../models/barangNonHandmade");
const Cabang = require("../models/cabang");
const JenisBarang = require("../models/jenisBarang");
const KategoriBarang = require("../models/kategoriBarang");
const Packaging = require("../models/packaging");
const StokBarang = require("../models/stokBarang");  
  
class StokBarangService {  
  static async create(data) {  
    return await StokBarang.create(data);  
  }  
  
  static async getAll(cabang) {  
    const whereConditions = {
      is_deleted: false,
    };

    if (cabang) {
      whereConditions.cabang_id = cabang;
    }

    const data = await StokBarang.findAll({
      where: whereConditions,
      include: [
        { model: Cabang, as: "cabang", attributes: ["nama_cabang"] },
        { model: BarangHandmade, as: "barang_handmade", attributes: ["nama_barang"],
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
            }
          ]
         },
        { model: BarangNonHandmade, as: "barang_non_handmade", attributes: ["nama_barang"],
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
            }
          ]
         },
        { model: BarangCustom, as: "barang_custom", attributes: ["nama_barang"],
          include: [
            {
              model: KategoriBarang,
              as: "kategori",
              attributes: ["nama_kategori_barang"]
            },
            {
              model: JenisBarang,
              as: "jenis_barang",
              attributes: ["nama_jenis_barang"]
            }
          ]
         },
        { model: Packaging, as: "packaging", attributes: ["nama_packaging"],
          include: [
            {
              model: JenisBarang,
              as: "jenis_barang",
              attributes: ["jenis_barang_id", "nama_jenis_barang"]
            },
            {
              model: KategoriBarang,
              as: "kategori_barang",
              attributes: ["kategori_barang_id", "nama_kategori_barang"]
            }
          ]
         },
      ]
    });  

    return data;
  }  
  
  static async getById(id) {  
    return await StokBarang.findOne({
      where: {
        stok_barang_id: id,
        is_deleted: false
      }
    });  
  }  
  
  static async update(id, data) {  
    const stokBarang = await StokBarang.findByPk(id);  
    if (!stokBarang) return null;  
  
    Object.assign(stokBarang, data);  
    await stokBarang.save();  
  
    return stokBarang;  
  }  
  
  static async delete(id) {  
    const stokBarang = await StokBarang.findByPk(id);  
    if (!stokBarang) return null;  
    await stokBarang.update({ is_deleted: true });  
    return true;  
  }  
}  
  
module.exports = StokBarangService;  
