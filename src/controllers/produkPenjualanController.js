const ProdukPenjualanService = require("../services/produkPenjualanService");

class ProdukPenjualanController {
    static async getAll(req, res) {
        try {
            const produkPenjualan = await ProdukPenjualanService.getAll();
            res.status(200).json({
                success: true,
                data: produkPenjualan,
                message: "retrieved successfully"
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                data: null,
                message: error.message
            });
        }
    }
}

module.exports = ProdukPenjualanController