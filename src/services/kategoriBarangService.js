const BarangHandmade = require("../models/barangHandmade");
const BarangHandmadeNon = require("../models/barangHandmadeNon");
const KategoriBarang = require("../models/kategoriBarang");

class KategoriBarangService {
    static async create(data) {
        return await KategoriBarang.create(data);
    }

    static async getAll() {
        return await KategoriBarang.findAll();
    }

    static async getById(id) {
        return await KategoriBarang.findByPk(id);
    }

    static async getBarang(id) {
        return await KategoriBarang.findOne({
            where: { kategori_barang_id: id },
            includes: {
                model: BarangHandmadeNon
            }
        })
    }
}

module.exports = KategoriBarangService;