const Karyawan = require("../models/karyawan");
const DivisiKaryawan = require("../models/divisiKaryawan");
const Cabang = require("../models/cabang");

class KaryawanService {
    static async getAll() {
        return await Karyawan.findAll({
            include: [
            {
                model: DivisiKaryawan,
                as: "divisi",
                attributes: ["nama_divisi"]
            },
            {
                model: Cabang,
                as: "cabang",
                attributes: ["nama_cabang"]
            },
            {
                model: Cabang,
                as: "cabang_first",
                attributes: ["nama_cabang"]
            }
        ]});
    }
    static async getById(id) {
        return await Karyawan.findOne({
            where: { karyawan_id: id },
            include:  [
                {
                    model: DivisiKaryawan,
                    as: "divisi",
                    attributes: ["nama_divisi"]
                },
                {
                    model: Cabang,
                    as: "cabang",
                    attributes: ["nama_cabang"]
                },
                {
                    model: Cabang,
                    as: "cabang_first",
                    attributes: ["nama_cabang"]
                }
        ]});
    }
    static async create(data) {
        const cabangIdFirst = data.cabang_id;
        data.cabang_id_first = cabangIdFirst;
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