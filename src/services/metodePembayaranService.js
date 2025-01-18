const { where } = require("sequelize");
const MetodePembayaran = require("../models/metodePembayaran");

class MetodePembayaranService {
    static async getAll() {
        return await MetodePembayaran.findAll({
            where: {is_deleted: false}
        });
    }
    static async getById(id) {
        return await MetodePembayaran.findOne({
            where: {
                metode_id: id,
                is_deleted: false
            }
        });
    }

    static async update(id, data) {
        const metode = await MetodePembayaran.findByPk(id);
        if (!metode) return null;
    
        Object.assign(metode, data);
        await metode.save();
    
        return metode;
      }

    static async create(data) {
        return await MetodePembayaran.create(data);
    }

    static async delete(id) {
        const metode = await MetodePembayaran.findByPk(id);
        if (!metode) return null
        await metode.update({ is_deleted: true });
        return true;
    }
}

module.exports = MetodePembayaranService;