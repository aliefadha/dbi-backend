const { sequelize } = require("../models");
const Cabang = require("../models/cabang");  
const TargetBulananKasir = require("../models/targetBulananKasir");
  
class CabangService {  
  static async create(data) {  
    const transaction = await sequelize.transaction();
    try {
      const existingCabang = await Cabang.findOne({
        where: {
          email: data.email
        }
      })
      if (existingCabang) {
        throw new Error("Email already exists");
      }
      const cabang = await Cabang.create(data, { transaction });
      const months = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
      ];

      for (const month of months) {
        await TargetBulananKasir.create({
          cabang_id: cabang.cabang_id,
          bulan: month,
          jumlah_target: 0
        }, { transaction });
      }

      await transaction.commit();
      return cabang;
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }  
  
  static async getAll(toko_id) {
    const whereConditions = {
        is_deleted: false
    }  

    if (toko_id) {
        whereConditions.toko_id = toko_id
    }
    return await Cabang.findAll({
        where: whereConditions
    });  
  }  
  
  static async getById(id) {  
    return await Cabang.findByPk(id);  
  }  
  
  static async update(id, data) {  
    const cabang = await Cabang.findByPk(id);  
    if (!cabang) return null;  
  
    Object.assign(cabang, data);  
    await cabang.save();  
  
    return cabang;  
  }  
  
  static async delete(id) {  
    const cabang = await Cabang.findByPk(id);  
    if (!cabang) return null;  
    await cabang.destroy();  
    return true;  
  }  
}  
  
module.exports = CabangService;  
