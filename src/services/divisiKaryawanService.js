const DivisiKaryawan = require("../models/divisiKaryawan");
const Karyawan = require("../models/karyawan");

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

    static async getKaryawanByDivisi(id) {
        return await DivisiKaryawan.findByPk(id, {
            include: {
                model: Karyawan,
                as: 'karyawan'
            }
        });
    }
}

module.exports = DivisiKaryawanService;