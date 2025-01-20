const MetodePembayaranGudang = require("../models/metodePembayaranGudang");
const PenjualanGudang = require("../models/penjualanGudang");  
  
class PenjualanGudangService {  
  static async create(data) {  
    return await PenjualanGudang.create(data);  
  }  
  
  static async getAll() {  
    return await PenjualanGudang.findAll({
      where: {
        is_deleted: false
      },
    });  
  }  
  
  static async getById(id) {  
    return await PenjualanGudang.findOne({
      where: {
        penjualan_id: id,
        is_deleted: false
      },
      include: [
        {
          model: MetodePembayaranGudang,
          as: "metode_pembayaran",
          attributes: ["nama_metode"]
        },
      ]
    });  
  }  
  
  static async update(id, data) {  
    const penjualanGudang = await PenjualanGudang.findByPk(id);  
    if (!penjualanGudang) return null;  
  
    Object.assign(penjualanGudang, data);  
    await penjualanGudang.save();  
  
    return penjualanGudang;  
  }  
  
  static async delete(id) {  
    const penjualanGudang = await PenjualanGudang.findByPk(id);  
    if (!penjualanGudang) return null;  
    await penjualanGudang.update({ is_deleted: true });  
    return true;  
  }  
}  
  
module.exports = PenjualanGudangService;  
