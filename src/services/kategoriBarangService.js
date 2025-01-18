
const KategoriBarang = require("../models/kategoriBarang");

class KategoriBarangService {
    static async create(data) {
        return await KategoriBarang.create(data);
    }

    static async update(id, data) {
        const kategoriBarang = await KategoriBarang.findByPk(id);
        if (!kategoriBarang) return null;

        Object.assign(kategoriBarang, data);
        await kategoriBarang.save();

        return kategoriBarang;
    }

    static async delete(id) {
        const kategori = await KategoriBarang.findByPk(id);
        if (!kategori) return null
        await kategori.update({ is_deleted: true });
        return true;
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
                model: Barang,
                as: 'barang'
            }
        }
        )
    }
}

module.exports = KategoriBarangService;