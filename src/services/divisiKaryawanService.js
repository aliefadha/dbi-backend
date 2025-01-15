const DivisiKaryawan = require("../models/divisiKaryawan");

class DivisiKaryawanService {
    static async getAll() {
        return await DivisiKaryawan.findAll();
    }

    static async getById(id) {
        return await DivisiKaryawan.findByPk(id);
    }

    static async create(data) {
        return await DivisiKaryawan.create(data);
    }
}

module.exports = DivisiKaryawanService;