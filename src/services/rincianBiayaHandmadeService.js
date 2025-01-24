const RincianBiayaHandmade = require("../models/rincianBiayaHandmade");  
  
class RincianBiayaHandmadeService {  
  static async create(data) {  
    return await RincianBiayaHandmade.create(data);  
  }  
  
  static async getAll() {  
    return await RincianBiayaHandmade.findAll({
      where: {
        is_deleted: false
      }
    });  
  }  
  
  static async getById(id) {  
    return await RincianBiayaHandmade.findOne({
      where: {
        rincian_biaya_handmade_id: id,
        is_deleted: false
      }
    });  
  }  
  
  static async update(id, data) {  
    const rincianBiayaHandmade = await RincianBiayaHandmade.findByPk(id);  
    if (!rincianBiayaHandmade) return null;  
  
    Object.assign(rincianBiayaHandmade, data);  
    await rincianBiayaHandmade.save();  
  
    return rincianBiayaHandmade;  
  }  
  
  static async delete(id) {  
    const rincianBiayaHandmade = await RincianBiayaHandmade.findByPk(id);  
    if (!rincianBiayaHandmade) return null;  
    await rincianBiayaHandmade.update({ is_deleted: true });  
    return true;  
  }  
}  
  
module.exports = RincianBiayaHandmadeService;  
