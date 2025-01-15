const DivisiKaryawanService = require("../services/divisiKaryawanService");

class DivisiKaryawanController {
    static async create(req, res) {
        try {
            const divisi = await DivisiKaryawanService.create(req.body);
            res.status(201).json({
                success: true,
                data: divisi,
                message: "Divisi created successfully",
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
            const divisi = await DivisiKaryawanService.getAll();
            res.status(200).json({
                success: true,
                data: divisi,
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
            const divisi = await DivisiKaryawanService.getById(req.params.id);
            if (!divisi) {
                return res.status(404).json({
                    success: false,
                    data: null,
                    message: "Data not found",
                });
            }
            res.status(200).json({
                success: true,
                data: divisi,
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
}

module.exports = DivisiKaryawanController;