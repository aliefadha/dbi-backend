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
        const karyawan = await Karyawan.findByPk(id);
        if (!karyawan) return null;

        Object.assign(karyawan, data);
        await karyawan.save();

        return karyawan;
    }
    static async delete(id) {
        return await Karyawan.destroy({ where: { karyawan_id: id } });
    }
}

module.exports = KaryawanService;