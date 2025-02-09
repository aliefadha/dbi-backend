const RincianBiayaCustom = require("../models/rincianBiayaCustom");  
  
class RincianBiayaCustomService {  
  static async create(data, options = {}) {  
    const transaction = options.transaction;
    return await RincianBiayaCustom.bulkCreate(data, {
      transaction,
      returning: true
    });  
  }  
  
  static async getAll() {  
    return await RincianBiayaCustom.findAll({
      where: {
        is_deleted: false
      }
    });  
  }  
  
  static async getById(id) {  
    return await RincianBiayaCustom.findOne({
      where: {
        rincian_biaya_custom_id: id,
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

        const penjualanId = data[0]?.penjualan_id;
        if (!penjualanId) {
            throw new Error("Missing penjualan_id in the data array");
        }

        // Fetch existing records
        const existingRecords = await RincianBiayaCustom.findAll({
            where: { penjualan_id: penjualanId },
            transaction
        });

        // Map existing records for quick lookup
        const existingRecordsMap = new Map(existingRecords.map(item => [item.rincian_biaya_custom_id, item]));

        // Track updated and new records
        const updatedIds = new Set();
        const newRecords = [];

        for (const item of data) {
            const existingItem = existingRecordsMap.get(item.rincian_biaya_custom_id);
            if (existingItem) {
                // Update only if there are changes
                if (Object.keys(item).some(key => item[key] !== existingItem[key])) {
                    await existingItem.update(item, { transaction });
                }
                updatedIds.add(item.rincian_biaya_custom_id);
            } else {
                newRecords.push(item);
            }
        }

        // Bulk insert new records (if any)
        if (newRecords.length > 0) {
            await RincianBiayaCustom.bulkCreate(newRecords, {
                transaction,
                updateOnDuplicate: ["nama_biaya", "jumlah_biaya", "penjualan_id"] // Ensures update if exists
            });
        }

        // Delete records that were not in the updated list
        const toDelete = existingRecords.filter(item => !updatedIds.has(item.rincian_biaya_custom_id));
        if (toDelete.length > 0) {
            await RincianBiayaCustom.destroy({
                where: { rincian_biaya_custom_id: toDelete.map(item => item.rincian_biaya_custom_id) },
                transaction
            });
        }

        if (!options.transaction) await transaction.commit(); // Commit if transaction was created here

        return { updated: [...updatedIds], inserted: newRecords.length, deleted: toDelete.length };
    } catch (error) {
        if (!options.transaction) await transaction.rollback(); // Rollback if transaction was created here
        throw error;
    }
}

  
  static async delete(id) {  
    const rincianBiayaCustom = await RincianBiayaCustom.findByPk(id);  
    if (!rincianBiayaCustom) return null;  
    await rincianBiayaCustom.update({ is_deleted: true });  
    return true;  
  }  
}  
  
module.exports = RincianBiayaCustomService;  
