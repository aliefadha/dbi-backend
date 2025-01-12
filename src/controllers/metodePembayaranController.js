const MetodePembayaranService = require("../services/metodePembayaranService");

class MetodePembayaranController {
    static async getAll(req, res) {
        try {
            const kategori = await MetodePembayaranService.getAll();
            res.status(200).json({
                success: true,
                data: kategori,
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

module.exports = MetodePembayaranController;