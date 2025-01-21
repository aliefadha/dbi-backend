const BiayaOperasionalStaffGudang = require("../models/biayaOperasionalStaffGudang");
const OperasionalStaffGudang = require("../models/operasionalStaffGudang");  
  
class OperasionalStaffGudangService {  
  static async create(data) {  
    return await OperasionalStaffGudang.create(data);  
  }  
  
  static async getAll() {  
    return await OperasionalStaffGudang.findAll({
      where: {
        is_deleted: false
      },
      attributes: ["nama_tabel", "total", "rata_rata", "total_biaya"],
      include: [
        {
          model: BiayaOperasionalStaffGudang,
          as: "biaya",
          required: false,
          where: { is_deleted: false },
          attributes: ["nama_biaya", "total_biaya"],
          separate: true
        }
      ]
    });  
  }  
  
  static async getById(id) {  
    return await OperasionalStaffGudang.findOne({
      where: {
        operasional_staff_id: id,
        is_deleted: false
      },
      attributes: ["nama_tabel", "total", "rata_rata", "total_biaya"],
      include: [
        {
          model: BiayaOperasionalStaffGudang,
          as: "biaya",
          required: false,
          where: { is_deleted: false },
          attributes: ["nama_biaya", "total_biaya"],
          separate: true
        }
      ]
    });  
  }  
  
  static async update(id, data) {  
    const operasionalStaffGudang = await OperasionalStaffGudang.findByPk(id);  
    if (!operasionalStaffGudang) return null;  
  
    Object.assign(operasionalStaffGudang, data);  
    await operasionalStaffGudang.save();  
  
    return operasionalStaffGudang;  
  }  
  
  static async delete(id) {  
    const operasionalStaffGudang = await OperasionalStaffGudang.findByPk(id);  
    if (!operasionalStaffGudang) return null;  
    await operasionalStaffGudang.update({ is_deleted: true });  
    return true;  
  }  
}  
  
module.exports = OperasionalStaffGudangService;  
