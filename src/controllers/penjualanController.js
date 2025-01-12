const PenjualanService = require("../services/penjualanService");

class PenjualanController {
    static async getAll(req, res) {
        try {
            const penjualan = await PenjualanService.getAll();
            res.status(200).json({
                success: true,
                data: penjualan,
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

module.exports = PenjualanController