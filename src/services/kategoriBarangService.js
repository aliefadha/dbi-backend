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

    static async getBarangByKategori(id) {
        return await KategoriBarang.findOne({
            where: { kategori_barang_id: id },
            include: {
                model: BarangHandmadeNon,
                as: 'barang'
            }
        }
        )
    }
}

module.exports = KategoriBarangService;