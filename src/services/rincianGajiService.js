const RincianGaji = require("../models/rincianGaji");  
  
class RincianGajiService {  
  static async create(data, options = {}) {  
    const transaction = options.transaction;
    return await RincianGaji.bulkCreate(data, {
      transaction,
      returning: true
    });
  }  
  
  static async getAll() {  
    return await RincianGaji.findAll({
      where: {
        is_deleted: false
      }
    });  
  }  
  
  static async getById(id) {  
    return await RincianGaji.findOne({
      where: {
        rincian_gaji_id: id,
        is_deleted: false
      }
    });  
  }  
  
  static async update(data, options = {}) {  
    const transaction = options.transaction;
    try {
      if (!Array.isArray(data) || data.length === 0) {
        throw new Error("Invalid input: Data must be a non-empty array");
      }

      const rincianGajiId = data[0]?.rincian_gaji_id;
      if (!rincianGajiId) {
        throw new Error("Missing rincian_gaji_id in the data array");
      }

      // Fetch existing records
      const existingRecords = await RincianGaji.findAll({
        where: { rincian_gaji_id: rincianGajiId },
        transaction
      });

      // Map existing records for quick lookup
      const existingRecordsMap = new Map(existingRecords.map(item => [item.rincian_gaji_id, item]));

      // Track updated and new records
      const updatedRecords = [];
      const newRecords = [];

      for (const record of data) {
        const existingRecord = existingRecordsMap.get(record.rincian_gaji_id);
        if (existingRecord) {
          // Update existing record
          if (Object.keys(record).some(key => record[key] !== existingRecord[key])) {
            await existingRecord.update(record, { transaction });
          }
          updatedRecords.push(existingRecord);
        } else {
          newRecords.push(record);
        }
      }

      // Bulk insert new records
      if (updatedRecords.length > 0) {
        await RincianGaji.bulkCreate(newRecords, { transaction });
      }

      const toDelete = existingRecords.filter(item => !data.some(record => record.rincian_gaji_id === item.rincian_gaji_id));
      if (toDelete.length > 0) {
        await RincianGaji.bulkUpdate({ is_deleted: true }, { where: { rincian_gaji_id: toDelete.map(item => item.rincian_gaji_id) }, transaction });
      }

      if (!options.transaction) await transaction.commit();

      return { updated: updatedRecords, inserted: newRecords, deleted: toDelete.length };
    }catch (error) {
      if (!options.transaction) await transaction.rollback();
      throw error;
    }  
  }
  
  static async delete(id) {  
    const rincianGaji = await RincianGaji.findByPk(id);  
    if (!rincianGaji) return null;  
    await rincianGaji.update({ is_deleted: true });  
    return true;  
  }  
}  
  
module.exports = RincianGajiService;  
