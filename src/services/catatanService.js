const Catatan = require("../models/catatan");  
const { Op } = require("sequelize");
class CatatanService {  
  static async create(data) {  
    return await Catatan.create(data);  
  }  
  
  static async getAll(bulan, tahun) {
    const startDate = new Date(tahun, bulan-1, 1);
    const endDate = new Date(tahun, bulan, 0); 
    const whereConditions = {
      is_deleted: false,
      createdAt: {
        [Op.between]: [startDate, endDate]
      }
    } 
    return await Catatan.findAll(
      {
        where: whereConditions,
        attributes: {
          exclude: ["is_deleted"]
        },
        order: [['createdAt', 'DESC']]
      }
    );  
  }  
  
  static async getById(id) {  
    return await Catatan.findByPk(id);  
  }  
  
  static async update(id, data) {  
    const catatan = await Catatan.findByPk(id);  
    if (!catatan) return null;  
  
    Object.assign(catatan, data);  
    await catatan.save();  
  
    return catatan;  
  }  
  
  static async delete(id) {  
    const catatan = await Catatan.findByPk(id);  
    if (!catatan) return null;  
    await catatan.update({ is_deleted: true });  
    return true;  
  }  
}  
  
module.exports = CatatanService;  
