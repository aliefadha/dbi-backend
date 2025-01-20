const BiayaOperasionalProduksiGudang = require("../models/biayaOperasionalProduksiGudang");  
  
class BiayaOperasionalProduksiGudangService {  
  static async create(data) {  
    return await BiayaOperasionalProduksiGudang.create(data);  
  }  
  
  static async getAll() {  
    return await BiayaOperasionalProduksiGudang.findAll({
      where: {
        is_deleted: false
      }
    });  
  }  
  
  static async getById(id) {  
    return await BiayaOperasionalProduksiGudang.findOne({
      where: {
        biaya_operasional_produksi_gudang_id: id,
        is_deleted: false
      }
    });  
  }  
  
  static async update(id, data) {  
    const biayaOperasionalProduksiGudang = await BiayaOperasionalProduksiGudang.findByPk(id);  
    if (!biayaOperasionalProduksiGudang) return null;  
  
    Object.assign(biayaOperasionalProduksiGudang, data);  
    await biayaOperasionalProduksiGudang.save();  
  
    return biayaOperasionalProduksiGudang;  
  }  
  
  static async delete(id) {  
    const biayaOperasionalProduksiGudang = await BiayaOperasionalProduksiGudang.findByPk(id);  
    if (!biayaOperasionalProduksiGudang) return null;  
    await biayaOperasionalProduksiGudang.update({ is_deleted: true });  
    return true;  
  }  
}  
  
module.exports = BiayaOperasionalProduksiGudangService;  
