const DeskripsiPemasukan = require("../models/deskripsiPemasukan");  
const { sequelize } = require("../models");  // Add this line
const Toko = require("../models/toko");
const Cabang = require("../models/cabang");
  
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
    const transaction = options.transaction || await sequelize.transaction();
    try {
      if (!Array.isArray(data) || data.length === 0) {
        throw new Error("Invalid input: Data must be a non-empty array");
      }

      const pemasukanId = data[0]?.pemasukan_id;
      if (!pemasukanId) {
        throw new Error("Missing pemasukan_id in the data array");
      }

      // Fetch existing records
      const existingRecords = await DeskripsiPemasukan.findAll({
        where: { pemasukan_id: pemasukanId },
        transaction
      });
      
      const existingRecordsMap = new Map(existingRecords.map(item => [item.deskripsi_pemasukan_id, item]));

      // Track updated and new records
      const updatedIds = new Set();
      const newRecords = [];

      for (const item of data) {
        const existingItem = existingRecordsMap.get(item.deskripsi_pemasukan_id);
        if (existingItem) {
          // Update only if there are changes
          if (Object.keys(item).some(key => item[key] !== existingItem[key])) {
            await existingItem.update(item, { transaction });
          } 
          updatedIds.add(item.deskripsi_pemasukan_id);
        } else {
          // Create new record
          newRecords.push(item);
        }
      }

      if (newRecords.length > 0) {
        await DeskripsiPemasukan.bulkCreate(newRecords, { transaction });
      }

      // Delete records that are no longer in the data array
      const toDelete = existingRecords.filter(item => !updatedIds.has(item.deskripsi_pemasukan_id));
      if (toDelete.length > 0) {
        await DeskripsiPemasukan.destroy({ 
          where: { 
            deskripsi_pemasukan_id: toDelete.map(item => item.deskripsi_pemasukan_id) 
          }, 
          transaction 
        });
      }

      if (!options.transaction) await transaction.commit();

      return { updated: [...updatedIds], new: newRecords.length, deleted: toDelete.length };
    } catch (error) {
      if (!options.transaction) await transaction.rollback();
      throw error;
    }
  }
  
  static async delete(id) {  
    return await DeskripsiPemasukan.destroy({
      where: {
        pemasukan_id: id
      }
    }) 
  }  
}  
  
module.exports = DeskripsiPemasukanService;
