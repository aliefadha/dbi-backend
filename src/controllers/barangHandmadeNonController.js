const BarangHandmadeNonService = require("../services/barangHandmadeNonService");

class BarangHandmadeNonController {
    static async create(req, res) {
        try {
            const kategori = await BarangHandmadeNonService.create(req.body);
            res.status(201).json({
                success: true,
                data: kategori,
                message: "Created successfully"
            })
        } catch (error) {
            res.status(400).json({
                success: false,
                data: null,
                message: error.message,
            })
        }
    }

    static async getAll(req, res) {
        try {
            const kategori = await BarangHandmadeNonService.getAll();
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

    static async getById(req, res) {
        try {
            const kategori = await BarangHandmadeNonService.getById(req.params.id);
            if (!kategori) {
                return res.status(404).json({
                    success: false,
                    data: null,
                    message: "Data not found",
                });
            }
            res.status(200).json({
                success: true,
                data: kategori,
                message: "retrieved successfully",
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                data: null,
                message: error.message,
            })
        }
    }
}

module.exports = BarangHandmadeNonController;