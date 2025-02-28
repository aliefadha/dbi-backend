const Packaging = require("../models/packaging");  
const JenisBarang = require("../models/jenisBarang");
const KategoriBarang = require("../models/kategoriBarang");
  
class PackagingService {  
  static async create(data) {  
    return await Packaging.create(data);  
  }  
  
  static async getAll(toko_id) {  
    const whereConditions = {
      is_deleted: false
    }

    if (toko_id) {
      whereConditions.toko_id = toko_id
    }
    return await Packaging.findAll({
      where: whereConditions,
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
      ],
      order: [['createdAt', 'DESC']]
    });  
  }  
  
  static async getById(id) {  
    return await Packaging.findOne({
      where: {
        packaging_id: id,
        is_deleted: false
      },
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
    });  
  }  
  
  static async update(id, data) {  
    const packaging = await Packaging.findByPk(id);  
    if (!packaging) return null;  
  
    Object.assign(packaging, data);  
    await packaging.save();  
  
    return packaging;  
  }  
  
  static async delete(id) {  
    const packaging = await Packaging.findByPk(id);  
    if (!packaging) return null;  
    await packaging.destroy();  
    return true;  
  }  
}  
  
module.exports = PackagingService;  
