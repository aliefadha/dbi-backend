const MetodePembayaran = require("../models/metodePembayaran");
const ProdukPenjualan = require("../models/produkPenjualan");

class ProdukPenjualanService {
    static async getAll() {
        return ProdukPenjualan.findAll({
            include: [
                {
                    model: MetodePembayaran,
                    attributes: ['nama_metode']
                }
            ]
        })
    }
}

module.exports = ProdukPenjualanService