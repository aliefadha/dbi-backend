const Karyawan = require("../models/karyawan");
const DivisiKaryawan = require("../models/divisiKaryawan");
const Cabang = require("../models/cabang");
const XLSX = require('xlsx');
const AbsensiKaryawanService = require("./absensiKaryawanService");

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

    static async getByUserId(id) {
        return await Karyawan.findOne({ 
            where: { karyawan_id: id },
            attributes: ["karyawan_id", "image", "email", "password", "nama_karyawan","nomor_handphone"]
        });
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

    static async exportToExcel(toko_id) {
        const result = await this.getAll(toko_id);
        // return result;
        const data = result.map(karyawan => ({
            nama_karyawan: karyawan.nama_karyawan,
            divisi: karyawan.divisi ? karyawan.divisi.nama_divisi : '',
            nomor_handphone: karyawan.nomor_handphone,
            email: karyawan.email
        }));

        const workbook = XLSX.utils.book_new();
        const worksheet = XLSX.utils.json_to_sheet(data);
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Karyawan');

        return workbook;
    }

    static async getTerbaik(toko_id, bulan, tahun) {
        const result = await AbsensiKaryawanService.getAll(bulan, tahun, toko_id);
        const data = result.map((item) => ({
            karyawan_id: item.karyawan.karyawan_id,
            nama_karyawan: item.karyawan.nama_karyawan,
            Image: item.karyawan.image,
            kpi: item.totalPersentaseTercapai
        }))
        return data.sort((a, b) => b.totalPersentaseTercapai - a.totalPersentaseTercapai);
    }

}

module.exports = KaryawanService;