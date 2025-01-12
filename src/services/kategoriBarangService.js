const KategoriBarang = require("../models/kategoriBarang");

class KategoriBarangService {
    static async create(data) {
        return await KategoriBarang.create(data);
    }

    static async getAll() {
        return await KategoriBarang.findAll();
    }

    static async getById(id) {
        return await KategoriBarang.findByPk(id);
    }
}

module.exports = KategoriBarangService;