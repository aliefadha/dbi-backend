const BarangHandmadeNon = require("../models/barangHandmadeNon");
const Packaging = require("../models/packaging");

class BarangHandmadeNonService {
    static async create(data) {
        return await BarangHandmadeNon.create(data);
    }

    static async getAll() {
        return await BarangHandmadeNon.findAll({
            include: [
                {
                    model: Packaging,
                }
            ]
        });
    }

    static async getById(id) {
        return await BarangHandmadeNon.findByPk(id);
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