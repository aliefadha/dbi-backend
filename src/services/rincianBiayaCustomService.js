const RincianBiayaCustom = require("../models/rincianBiayaCustom");  
  
class RincianBiayaCustomService {  
  static async create(data, options = {}) {  
    const transaction = options.transaction;
    return await RincianBiayaCustom.bulkCreate(data, {
      transaction,
      returning: true
    });  
  }  
  
  static async getAll() {  
    return await RincianBiayaCustom.findAll({
      where: {
        is_deleted: false
      }
    });  
  }  
  
  static async getById(id) {  
    return await RincianBiayaCustom.findOne({
      where: {
        rincian_biaya_custom_id: id,
        is_deleted: false
      }
    });  
  }  
  
  static async update(id, data) {  
    const existingRincianBiayaCustom = await RincianBiayaCustom.findAll({
      where: {
        penjualan_id: id
      }
    });  
    
    const existingRincianBiayaCustomMap = {};
    existingRincianBiayaCustom.forEach(rincianCustom => {
      existingRincianBiayaCustomMap[rincianCustom.rincian_biaya_custom_id] = rincianCustom;
    });

    const updatedBiayaRincianCustom = [];

    for (const rincianBiayaCustomData of data) {
      if (existingRincianBiayaCustomMap[rincianBiayaCustomData.rincian_biaya_custom_id]) {
        Object.assign(existingRincianBiayaCustomMap[rincianBiayaCustomData.rincian_biaya_custom_id], rincianBiayaCustomData);
        await existingRincianBiayaCustomMap[rincianBiayaCustomData.rincian_biaya_custom_id].save();
        updatedBiayaRincianCustom.push(rincianBiayaCustomData.rincian_biaya_custom_id);
      } else {
        const newRincianBiayaCustom = await RincianBiayaCustom.create(rincianBiayaCustomData);
        updatedBiayaRincianCustom.push(newRincianBiayaCustom.rincian_biaya_custom_id);
      }
    }

    for (const rincianBiayaCustom of existingRincianBiayaCustom) {
      if (!updatedBiayaRincianCustom.includes(Kpi.rincian_biaya_custom_id)) {
        await rincianBiayaCustom.destroy();
      }
    }

    return updatedBiayaRincianCustom;
  }  
  
  static async delete(id) {  
    const rincianBiayaCustom = await RincianBiayaCustom.findByPk(id);  
    if (!rincianBiayaCustom) return null;  
    await rincianBiayaCustom.update({ is_deleted: true });  
    return true;  
  }  
}  
  
module.exports = RincianBiayaCustomService;  
