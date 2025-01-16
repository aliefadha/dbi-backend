const BarangNonHandmade = require("../models/barangNonHandmade");
const KategoriBarang = require("../models/kategoriBarang");
const Packaging = require("../models/packaging");
const JenisBarang = require("../models/jenisBarang");

class BarangNonHandmadeService {
    static async create(data) {
        return await BarangNonHandmade.create(data);
    }

    static async getAll() {
        return await BarangNonHandmade.findAll({
            include: [
                {
                    model: KategoriBarang,
                    as: 'kategori'
                },
                {
                    model: JenisBarang,
                    as: 'jenis'
                },
                {
                    model: Packaging,
                    as: "packaging"
                },
            ]
        });
    }

    static async getById(id) {
        return await BarangNonHandmade.findOne({
            where: { barang_id: id },
            include: [
                {
                    model: KategoriBarang,
                    as: 'kategori'
                },
                {
                    model: JenisBarang,
                    as: 'jenis'
                },
                {
                    model: Packaging,
                    as: "packaging"
                },
            ]
        });
    }

    static async update(id, data) {
        const barang = await BarangNonHandmade.findByPk(id);
        if (!barang) return null;

        Object.assign(barang, data);
        await barang.save();

        return barang;
    }

    static async delete(id) {
        const barang = await BarangNonHandmade.findByPk(id);
        if (!barang) return null;
        await barang.destroy();
        return true;
    }
}

module.exports = BarangNonHandmadeService;