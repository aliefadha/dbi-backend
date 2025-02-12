const { sequelize } = require("../models");
const Pengeluaran = require("../models/pengeluaran");  
const DeskripsiPengeluaranService = require("./deskripsiPengeluaranService");
  
class PengeluaranService {  
  static async create(data) {  
    const transaction = await sequelize.transaction();
    try {
      const pengeluaran = await Pengeluaran.create(data, { transaction });
      const DeskripsiPengeluaran = data.deskripsi_pengeluaran.map(item => ({
        ...item,
        pengeluaran_id: pengeluaran.pengeluaran_id
      }));

      await DeskripsiPengeluaranService.create(DeskripsiPengeluaran, { transaction });

      await transaction.commit();
      return pengeluaran;
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }  
  
  static async getAll() {  
    return await Pengeluaran.findAll({
      where: {
        is_deleted: false
      }
    });  
  }  
  
  static async getById(id) {  
    return await Pengeluaran.findOne({
      where: {
        pengeluaran_id: id,
        is_deleted: false
      }
    });  
  }  
  
  static async update(id, data) {  
    const transaction = await sequelize.transaction();

    try {
      const pengeluaran = await Pengeluaran.findOne({
        where: {
          pengeluaran_id: id,
          is_deleted: false
        }
      });
        
      if (!pengeluaran) return null;
      await pengeluaran.update(data, { transaction});

      if (data.deskripsi_pengeluaran && Array.isArray(data.deskripsi_pengeluaran)) {
        const DeskripsiPengeluaran = data.deskripsi_pengeluaran.map(item => ({
          ...item,
          pengeluaran_id: pengeluaran.pengeluaran_id
        }));

        await DeskripsiPengeluaranService.update(DeskripsiPengeluaran, { transaction });
      }

      await transaction.commit();

      const updatePengeluaran = await this.getById(id);
      return updatePengeluaran;
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }  
  
  static async delete(id) {  
    const pengeluaran = await Pengeluaran.findByPk(id);  
    if (!pengeluaran) return null;  
    await pengeluaran.update({ is_deleted: true });  
    return true;  
  }  
}  
  
module.exports = PengeluaranService;  
