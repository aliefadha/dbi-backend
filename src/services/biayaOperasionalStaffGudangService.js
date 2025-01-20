const BiayaOperasionalStaffGudang = require("../models/biayaOperasionalStaffGudang");  
  
class BiayaOperasionalStaffGudangService {  
  static async create(data) {  
    return await BiayaOperasionalStaffGudang.create(data);  
  }  
  
  static async getAll() {  
    return await BiayaOperasionalStaffGudang.findAll({
      where: {
        is_deleted: false
      }
    });  
  }  
  
  static async getById(id) {  
    return await BiayaOperasionalStaffGudang.findOne({
      where: {
        biaya_operasional_staff_gudang_id: id,
        is_deleted: false
      }
    });  
  }  
  
  static async update(id, data) {  
    const biayaOperasionalStaffGudang = await BiayaOperasionalStaffGudang.findByPk(id);  
    if (!biayaOperasionalStaffGudang) return null;  
  
    Object.assign(biayaOperasionalStaffGudang, data);  
    await biayaOperasionalStaffGudang.save();  
  
    return biayaOperasionalStaffGudang;  
  }  
  
  static async delete(id) {  
    const biayaOperasionalStaffGudang = await BiayaOperasionalStaffGudang.findByPk(id);  
    if (!biayaOperasionalStaffGudang) return null;  
    await biayaOperasionalStaffGudang.update({ is_deleted: true });  
    return true;  
  }  
}  
  
module.exports = BiayaOperasionalStaffGudangService;  
