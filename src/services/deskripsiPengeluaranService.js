const DeskripsiPengeluaran = require("../models/deskripsiPengeluaran");  
  
class DeskripsiPengeluaranService {  
  static async create(data, options = {}) {  
    const transaction = options.transaction;
    return await DeskripsiPengeluaran.bulkCreate(data, {
      transaction,
      returning: true
    });
  }  
  
  static async getAll() {  
    return await DeskripsiPengeluaran.findAll({
      where: {
        is_deleted: false
      }
    });  
  }  
  
  static async getById(id) {  
    return await DeskripsiPengeluaran.findOne({
      where: {
        deskripsi_pengeluaran_id: id,
        is_deleted: false
      }
    });  
  }  
  
  static async update(data, options = {}) {  
    const transaction = options.transaction || await sequelize.transaction(); // Ensure transaction  
    try {
      if (!Array.isArray(data) || data.length === 0) {
        throw new Error("Invalid input: Data must be a non-empty array");
      }

      const pengeluaranId = data[0]?.pengeluaran_id;
      if (!pengeluaranId) {
        throw new Error("Missing pengeluaran_id in the data array");
      }

      // Fetch existing records
      const existingRecords = await DeskripsiPengeluaran.findAll({
        where: { pengeluaran_id: pengeluaranId },
        transaction
      });
      
      const existingRecordsMap = new Map(existingRecords.map(item => [item.deskripsi_pengeluaran_id, item]));

      // Track updated and new records
      const updatedIds = new Set();
      const newRecords = [];

      for (const item of data) {
        const existingItem = existingRecordsMap.get(item.deskripsi_pengeluaran_id);
        if (existingItem) {
          // Update only if there are changes
          if (Object.keys(item).some(key => item[key] !== existingItem[key])) {
            await existingItem.update(item, { transaction });
          } 
          updatedIds.add(item.deskripsi_pengeluaran_id);
        } else {
          // Create new record
          newRecords.push(item);
        }
      }

      if (newRecords.length > 0) {
        await DeskripsiPengeluaran.bulkCreate(newRecords, { transaction });
      }

      // Mark existing records as deleted
      const toDelete = existingRecords.filter(item => !updatedIds.has(item.deskripsi_pengeluaran_id));
      if (toDelete.length > 0) {
        await DeskripsiPengeluaran.bulkDestroy({ where: { deskripsi_pengeluaran_id: toDelete.map(item => item.deskripsi_pengeluaran_id) }, transaction });
      }

      if (!options.transaction) await transaction.commit();

      return { updated: [...updatedIds], new: newRecords.length, deleted: toDelete.length };
    } catch (error) {
      if (!options.transaction) await transaction.rollback();
      throw error;
    }
  }  
  
  static async delete(id) {  
    const deskripsiPengeluaran = await DeskripsiPengeluaran.findByPk(id);  
    if (!deskripsiPengeluaran) return null;  
    await deskripsiPengeluaran.update({ is_deleted: true });  
    return true;  
  }  
}  
  
module.exports = DeskripsiPengeluaranService;  
