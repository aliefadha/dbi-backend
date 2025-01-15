const MetodePembayaran = require("../models/metodePembayaran");
const Penjualan = require("../models/penjualan");

class PenjualanService {
    static async getAll() {
        return Penjualan.findAll({
            include: [
                {
                    model: MetodePembayaran,
                    attributes: ['nama_metode']
                }
            ]
        })
    }
}

module.exports = PenjualanService