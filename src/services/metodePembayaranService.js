const MetodePembayaran = require("../models/metodePembayaran");

class MetodePembayaranService {
    static async getAll() {
        return await MetodePembayaran.findAll();
    }
}

module.exports = MetodePembayaranService;