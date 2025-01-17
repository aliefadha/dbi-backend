const BarangNonHandmadeService = require("../services/barangNonHandmadeService");

class BarangNonHandmadeController {
    static async create(req, res) {
        try {
            const kategori = await BarangNonHandmadeService.create(req.body);
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
            const barang = await BarangNonHandmadeService.getAll();
            res.status(200).json({
                success: true,
                data: barang,
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
            const barang = await BarangNonHandmadeService.getById(req.params.id);
            if (!barang) {
                return res.status(404).json({
                    success: false,
                    data: null,
                    message: "Data not found",
                });
            }
            res.status(200).json({
                success: true,
                data: barang,
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

    static async delete(req, res) {
        try {
            const deleted = await BarangNonHandmadeService.delete(req.params.id);
            if (!deleted) {
                return res.status(404).json({
                    success: false,
                    data: null,
                    message: "not found",
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

    static async update(req, res) {
        try {
            const barangNonHandmade = await BarangNonHandmadeService.update(req.params.id, req.body);
            if (!barangNonHandmade) {
                return res.status(404).json({
                    success: false,
                    data: null,
                    message: "Barang Non Handmade Not Found"
                });
            } res.status(200).json({
                success: true,
                data: barangNonHandmade,
                message: "Barang Non Handmade updated successfully",
            });
        } catch (error) {
            res.status(400).json({
                success: false,
                data: null,
                message: error.message,
            });
        }
    }

    static async getBarangByKategori(req, res) {
        try {
            const kategori = await BarangNonHandmadeService.getBarangByKateogri(req.params.id);
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

module.exports = BarangNonHandmadeController;