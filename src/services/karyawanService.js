const Karyawan = require("../models/karyawan");
const DivisiKaryawan = require("../models/divisiKaryawan");
const Cabang = require("../models/cabang");

class KaryawanService {
    static async getAll(toko_id) {
        const whereConditions = {
            is_deleted: false
        }
        if (toko_id) {
            whereConditions.toko_id = toko_id
        }
        return await Karyawan.findAll({
            where: whereConditions,
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
            where: { karyawan_id: id, is_deleted: false },
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
        try {
            if(data.cabangId){
                const cabangIdFirst = data.cabang_id;
                data.cabang_id_first = cabangIdFirst;
            }
            const existingKaryawan = await Karyawan.findOne({ where: { email: data.email } });
            if (existingKaryawan) {
                throw new Error("Email already exists");
            }
            return await Karyawan.create(data);
        } catch (error) {
            throw error;
        }    
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