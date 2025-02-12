const KategoriPemasukan = require("../models/kategoriPemasukan");  
  
class KategoriPemasukanService {  
  static async create(data) {  
    return await KategoriPemasukan.create(data);  
  }  
  
  static async getAll() {  
    return await KategoriPemasukan.findAll({
      where: {
        is_deleted: false
      },
      attributes: {
        exclude: ["is_deleted"]
      }
    });  
  }  
  
  static async getById(id) {  
    return await KategoriPemasukan.findOne({
      where: {
        kategori_pemasukan_id: id,
        is_deleted: false
      }
    });  
  }  
  
  static async update(id, data) {  
    const kategoriPemasukan = await KategoriPemasukan.findByPk(id);  
    if (!kategoriPemasukan) return null;  
  
    Object.assign(kategoriPemasukan, data);  
    await kategoriPemasukan.save();  
  
    return kategoriPemasukan;  
  }  
  
  static async delete(id) {  
    const kategoriPemasukan = await KategoriPemasukan.findByPk(id);  
    if (!kategoriPemasukan) return null;  
    await kategoriPemasukan.update({ is_deleted: true });  
    return true;  
  }  
}  
  
module.exports = KategoriPemasukanService;  
