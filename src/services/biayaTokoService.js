const BiayaToko = require("../models/biayaToko");  

class BiayaTokoService {  
  static async create(data) {  
    const { cabang_id, persentase } = data;

    const biayaToko = await BiayaToko.create({
      cabang_id,
      persentase
    });

    return biayaToko;
  }  
  
  static async getAll() {  
    return await BiayaToko.findAll({
      where: {
        is_deleted: false
      },
      attributes: {
        exclude: ["is_deleted", "total", "rata_rata", "total_biaya"]
      }
    });  
  }  
  
  static async getById(id) {  
    return await BiayaToko.findOne({
      where: {
        cabang_id: id,
        is_deleted: false
      },
      attributes: {
        exclude: ["is_deleted", "total", "rata_rata", "total_biaya"]
      }
    });  
  }  
  
  static async update(id, data) {  
    const { persentase } = data;
    const biayaToko = await BiayaToko.findOne({
      where: {
        cabang_id: id
      }
    });  
    if (!biayaToko) return null;  
    await biayaToko.update({
      persentase
    });
  
    return biayaToko;  
  }  
  
  static async delete(id) {  
    const biayaToko = await BiayaToko.findByPk(id);  
    if (!biayaToko) return null;  
    await biayaToko.update({ is_deleted: true });  
    return true;  
  }  
}  
  
module.exports = BiayaTokoService;  
