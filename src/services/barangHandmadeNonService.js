const BarangHandmadeNon = require("../models/barangHandmadeNon");

class BarangHandmadeNonService {
    static async create(data) {
        return await BarangHandmadeNon.create(data);
    }

    static async getAll() {
        return await BarangHandmadeNon.findAll();
    }

    static async getById(id) {
        return await BarangHandmadeNon.findByPk(id);
    }
}

module.exports = BarangHandmadeNonService;