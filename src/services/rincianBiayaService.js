const RincianBiaya = require("../models/rincianBiaya");

class RincianBiayaService {
    static async create(data) {
        return await RincianBiaya.create(data);
    }

    static async getAll() {
        return await RincianBiaya.findAll();
    }

    static async getById(id) {
        return await RincianBiaya.findByPk(id);
    }

    static async update(id, data) {
        const rincian = await RincianBiaya.findByPk(id);
        if (!rincian) return null;

        Object.assign(rincian, data);
        await rincian.save();

        return rincian;
    }

    static async delete(id) {
        const rincian = await RincianBiaya.findByPk(id);
        if (!rincian) return null;
        await rincian.destroy();
        return true;
    }

}

module.exports = RincianBiayaService;