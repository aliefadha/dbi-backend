const RincianBiayaGudang = require("../models/rincianBiayaGudang");  
  
class RincianBiayaGudangService {  
  static async create(data, options = {}) {  
    return await RincianBiayaGudang.create(data, options);  
  }  
  
  static async createMany(data, options = {}) {
      return await RincianBiayaGudang.bulkCreate(data, options);
    }
  
  static async getAll() {  
    return await RincianBiayaGudang.findAll({
      where: {
        is_deleted: false
      }
    });  
  }  
  
  static async getById(id) {  
    return await RincianBiayaGudang.findOne({
      where: {
        is_deleted: false
      }
    });  
  }  
  
  static async update(id, data) {  
    const rincianBiayaGudang = await RincianBiayaGudang.findByPk(id);  
    if (!rincianBiayaGudang) return null;  
  
    Object.assign(rincianBiayaGudang, data);  
    await rincianBiayaGudang.save();  
  
    return rincianBiayaGudang;  
  }  
  
  static async delete(id) {  
    const rincianBiayaGudang = await RincianBiayaGudang.findByPk(id);  
    if (!rincianBiayaGudang) return null;  
    await rincianBiayaGudang.update({ is_deleted: true });  
    return true;  
  }  

  static async deleteByBarangId(barangHandmadeId, options = {}) {
    return await RincianBiayaGudang.update(
      { is_deleted: true },
      {
        where: {
          barang_handmade_id: barangHandmadeId,
          is_deleted: false
        },
        ...options
      }
    );
  }
}  
  
module.exports = RincianBiayaGudangService;
