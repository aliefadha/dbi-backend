const { where } = require("sequelize");
const BarangCustom = require("../models/barangCustom"); 
const JenisBarang = require("../models/jenisBarang");
const KategoriBarang = require("../models/kategoriBarang"); 
  
class BarangCustomService {  
  static async create(data) {  
    return await BarangCustom.create(data);  
  }  
  
  static async getAll(toko_id) {  
    const whereConditions = {
      is_deleted: false
    }

    if (toko_id) {
      whereConditions.toko_id = toko_id
    }

    return await BarangCustom.findAll({
      where: whereConditions,
      include: [
        { model: JenisBarang, as: "jenis_barang" },
        { model: KategoriBarang, as: "kategori" },
      ],
      order: [['createdAt', 'DESC']]
    });  
  }  
  
  static async getById(id) {  
    return await BarangCustom.findOne({
      where: {
        barang_custom_id: id,
        is_deleted: false
      },
      include: [
        { model: JenisBarang, as: "jenis_barang" },
        { model: KategoriBarang, as: "kategori" },
      ]
    });  
  }  
  
  static async update(id, data) {  
    const barangCustom = await BarangCustom.findByPk(id);  
    if (!barangCustom) return null;  
  
    Object.assign(barangCustom, data);  
    await barangCustom.save();  
  
    return barangCustom;  
  }  
  
  static async delete(id) {  
    const barangCustom = await BarangCustom.findByPk(id);  
    if (!barangCustom) return null;
    await barangCustom.destroy(); 
    return true;    
  }  
}  
  
module.exports = BarangCustomService;  
