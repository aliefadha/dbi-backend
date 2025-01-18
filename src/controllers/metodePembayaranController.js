const MetodePembayaranService = require("../services/metodePembayaranService");

class MetodePembayaranController {
    static async create(req, res) {
        try {
            const metode = await MetodePembayaranService.create(req.body);
            res.status(201).json({
                success: true,
                data: metode,
                message: "created successfully",
            });
        } catch (error) {
            res.status(400).json({
                success: false,
                data: null,
                message: error.message,
            });
        }
    }

    static async getAll(req, res) {
        try {
            const metode = await MetodePembayaranService.getAll();
            res.status(200).json({
                success: true,
                data: metode,
                message: "retrieved successfully",
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                data: null,
                message: error.message,
            });
        }
    }

    static async getById(req, res) {
        try {
            const metode = await MetodePembayaranService.getById(req.params.id);
            if (!metode) {
                return res.status(404).json({
                    success: false,
                    data: null,
                    message: "not found",
                });
            }
            res.status(200).json({
                success: true,
                data: metode,
                message: "retrieved successfully",
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                data: null,
                message: error.message,
            });
        }
    }

    static async update(req, res) {
        try {
            const metode = await MetodePembayaranService.update(req.params.id, req.body);
            if (!metode) {
                return res.status(404).json({
                    success: false,
                    data: null,
                    message: "not found",
                });
            }
            res.status(200).json({
                success: true,
                data: metode,
                message: "updated successfully",
            });
        } catch (error) {
            res.status(400).json({
                success: false,
                data: null,
                message: error.message,
            });
        }
    }

    static async delete(req, res) {
        try {
            const deleted = await MetodePembayaranService.delete(req.params.id);
            if (!deleted) {
                return res.status(404).json({
                    success: false,
                    data: null,
                    message: " not found",
                });
            }
            res.status(200).json({
                success: true,
                data: null,
                message: "deleted successfully",
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                data: null,
                message: error.message,
            });
        }
    }
}

module.exports = MetodePembayaranController;