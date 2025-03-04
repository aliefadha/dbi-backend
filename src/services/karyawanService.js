const Karyawan = require("../models/karyawan");
const DivisiKaryawan = require("../models/divisiKaryawan");
const Cabang = require("../models/cabang");
const XLSX = require('xlsx');
const AbsensiKaryawanService = require("./absensiKaryawanService");

class KaryawanService {
    static async getAll(toko_id, divisi) {
        const whereConditions = {
            is_deleted: false
        }
        if (toko_id) {
            whereConditions.toko_id = toko_id
        }
        if (divisi){
            whereConditions.divisi_karyawan_id = divisi
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
        ],
    order: [['createdAt', 'DESC']]});
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
            if(data.cabang_id){
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
        try {
            const karyawan = await Karyawan.findByPk(id);
            if (!karyawan) return null;
            if (data.email) {
                const existingUser = await Karyawan.findOne({ where: { email: data.email } });
                if (existingUser && existingUser.karyawan_id != id) {
                    throw new Error('Email already exists');
                }
            }
            Object.assign(karyawan, data);
            await karyawan.save();
    
            return karyawan;
        }
        catch (error) {
            throw error;
        }
    }
    static async delete(id) {
        return await Karyawan.destroy({ where: { karyawan_id: id } });
    }

    static async exportToExcel(toko_id, divisi) {
        const result = await this.getAll(toko_id, divisi);
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

    static async getTerbaik(toko_id, cabang, bulan, tahun) {
        const result = await AbsensiKaryawanService.getAll(bulan, tahun, toko_id, cabang);
        const data = result.map((item) => ({
            karyawan_id: item.karyawan.karyawan_id,
            nama_karyawan: item.karyawan.nama_karyawan,
            Image: item.karyawan.image,
            kpi: item.totalPersentaseTercapai
        }))
        return data
            .sort((a, b) => b.totalPersentaseTercapai - a.totalPersentaseTercapai)
            .slice(0, 10);
    }

}

module.exports = KaryawanService;