const BiayaOperasionalProduksiGudang = require("../models/biayaOperasionalProduksiGudang");
const OperasionalProduksiGudang = require("../models/operasionalProduksiGudang");  
  
class OperasionalProduksiGudangService {  
  static async create(data) {  
    return await OperasionalProduksiGudang.create(data);  
  }  
  
  static async getAll() {  
    return await OperasionalProduksiGudang.findAll({
      where: {
        is_deleted: false
      },
      attributes: ["nama_tabel", "total", "waktu_kerja", "total_modal"],
      include: [
        {
          model: BiayaOperasionalProduksiGudang,
          as: "biaya",
          required: false,
          where: { is_deleted: false },
          attributes: ["nama_divisi", "total_biaya"],
          separate: true
        }
      ]
    });  
  }  
  
  static async getById(id) {  
    return await OperasionalProduksiGudang.findOne({
      where: {
        operasional_produksi_id: id,
        is_deleted: false
      },
      attributes: ["nama_tabel", "total", "waktu_kerja", "total_modal"],
      include: [
        {
          model: BiayaOperasionalProduksiGudang,
          as: "biaya",
          required: false,
          where: { is_deleted: false },
          attributes: ["nama_divisi", "total_biaya"],
          separate: true
        }
      ]
    });  
  }  
  
  static async update(id, data) {  
    const operasionalProduksiGudang = await OperasionalProduksiGudang.findByPk(id);  
    if (!operasionalProduksiGudang) return null;  
  
    Object.assign(operasionalProduksiGudang, data);  
    await operasionalProduksiGudang.save();  
  
    return operasionalProduksiGudang;  
  }  
  
  static async delete(id) {  
    const operasionalProduksiGudang = await OperasionalProduksiGudang.findByPk(id);  
    if (!operasionalProduksiGudang) return null;  
    await operasionalProduksiGudang.update({ is_deleted: true });  
    return true;  
  }  
}  
  
module.exports = OperasionalProduksiGudangService;  
