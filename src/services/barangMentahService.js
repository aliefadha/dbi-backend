const BarangMentah = require("../models/barangMentah");  
  
class BarangMentahService {  
  static async create(data) {  
    return await BarangMentah.create(data);  
  }  
  
  static async getAll() {  
    return await BarangMentah.findAll({
      where: {
        is_deleted: false
      },
      order: [['createdAt', 'DESC']]
    });  
  }  
  
  static async getById(id) {  
    return await BarangMentah.findOne({
      where: {
        barang_mentah_id: id,
        is_deleted: false
      }
    });  
  }  
  
  static async update(id, data) {  
    const barangMentah = await BarangMentah.findByPk(id);  
    if (!barangMentah) return null;  
  
    Object.assign(barangMentah, data);  
    await barangMentah.save();  
  
    return barangMentah;  
  }  
  
  static async delete(id) {  
    const barangMentah = await BarangMentah.findByPk(id);  
    if (!barangMentah) return null;  
    await barangMentah.update({ is_deleted: true });  
    return true;  
  }  
}  
  
module.exports = BarangMentahService;  
