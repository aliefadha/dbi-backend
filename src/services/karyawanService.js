const Karyawan = require("../models/karyawan");

class KaryawanService {
    static async getAll() {
        return await Karyawan.findAll();
    }
    static async getById(id) {
        return await Karyawan.findByPk(id);
    }
    static async create(data) {
        return await Karyawan.create(data);
    }
    static async update(id, data) {
        return await Karyawan.update(data, { where: { karyawan_id: id } });
    }
    static async delete(id) {
        return await Karyawan.destroy({ where: { karyawan_id: id } });
    }
}

module.exports = KaryawanService;