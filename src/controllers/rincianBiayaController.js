const RincianBiayaService = require("../services/rincianBiayaService");

class RincianBiayaController {
    static async create(req, res) {
        try {
            const rincian = await RincianBiayaService.create(req.body);
            res.status(201).json({
                success: true,
                data: rincian,
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
            const rincian = await RincianBiayaService.getAll();
            res.status(200).json({
                success: true,
                data: rincian,
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
            const rincian = await RincianBiayaService.getById(req.params.id);
            if (!rincian) {
                return res.status(404).json({
                    success: false,
                    data: null,
                    message: "not found",
                });
            }
            res.status(200).json({
                success: true,
                data: rincian,
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
            const rincian = await RincianBiayaService.update(req.params.id, req.body);
            if (!rincian) {
                return res.status(404).json({
                    success: false,
                    data: null,
                    message: "not found",
                });
            }
            res.status(200).json({
                success: true,
                data: rincian,
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
            const deleted = await RincianBiayaService.delete(req.params.id);
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

module.exports = RincianBiayaController;
