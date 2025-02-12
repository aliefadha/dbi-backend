const KategoriPengeluaran = require("../models/kategoriPengeluaran");  
  
class KategoriPengeluaranService {  
  static async create(data) {  
    return await KategoriPengeluaran.create(data);  
  }  
  
  static async getAll() {  
    return await KategoriPengeluaran.findAll({
      where: {
        is_deleted: false
      },
      attributes: {
        exclude: ["is_deleted"]
      }
    });  
  }  
  
  static async getById(id) {  
    return await KategoriPengeluaran.findOne({
      where: {
        kategori_pengeluaran_id: id,
        is_deleted: false
      }
    });  
  }  
  
  static async update(id, data) {  
    const kategoriPengeluaran = await KategoriPengeluaran.findByPk(id);  
    if (!kategoriPengeluaran) return null;  
  
    Object.assign(kategoriPengeluaran, data);  
    await kategoriPengeluaran.save();  
  
    return kategoriPengeluaran;  
  }  
  
  static async delete(id) {  
    const kategoriPengeluaran = await KategoriPengeluaran.findByPk(id);  
    if (!kategoriPengeluaran) return null;  
    await kategoriPengeluaran.update({ is_deleted: true });  
    return true;  
  }  
}  
  
module.exports = KategoriPengeluaranService;  
