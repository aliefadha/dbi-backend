const DeskripsiPemasukan = require("../models/deskripsiPemasukan");  
  
class DeskripsiPemasukanService {  
  static async create(data, options = {}) {  
    const transaction = options.transaction;
    return await DeskripsiPemasukan.bulkCreate(data, {
      transaction,
      returning: true
    });  
  }  
  
  static async getAll() {  
    return await DeskripsiPemasukan.findAll({
      where: {
        is_deleted: false
      }
    });  
  }  
  
  static async getById(id) {  
    return await DeskripsiPemasukan.findOne({
      where: {
        deskripsi_pemasukan_id: id,
        is_deleted: false
      }
    });  
  }  
  
  static async update(data, options = {}) {  
 
   
  }  
  
  static async delete(id) {  
    const deskripsiPemasukan = await DeskripsiPemasukan.findByPk(id);  
    if (!deskripsiPemasukan) return null;  
    await deskripsiPemasukan.update({ is_deleted: true });  
    return true;  
  }  
}  
  
module.exports = DeskripsiPemasukanService;  
