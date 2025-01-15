const { where } = require("sequelize");
const BarangHandmadeNon = require("../models/barangHandmadeNon");
const KategoriBarang = require("../models/kategoriBarang");
const Packaging = require("../models/packaging");
const JenisBarang = require("../models/jenisBarang");

class BarangHandmadeNonService {
    static async create(data) {
        return await BarangHandmadeNon.create(data);
    }

    static async getAll() {
        return await BarangHandmadeNon.findAll({
            include: [

                {
                    model: KategoriBarang,
                    as: 'kategori'
                },
                {
                    model: JenisBarang,
                    as: 'jenis'
                }
            ]
        });
    }

    static async getById(id) {
        return await BarangHandmadeNon.findOne({
            where: { barang_id: id },
            include: [
                {
                    model: Packaging,
                },
                {
                    model: KategoriBarang,
                }
            ]
        });
    }

    static async update(id, data) {
        const barang = await BarangHandmadeNon.findByPk(id);
        if (!barang) return null;

        Object.assign(barang, data);
        await barang.save();

        return barang;
    }

    static async delete(id) {
        const barang = await BarangHandmadeNon.findByPk(id);
        if (!barang) return null;
        await barang.destroy();
        return true;
    }
}

module.exports = BarangHandmadeNonService;