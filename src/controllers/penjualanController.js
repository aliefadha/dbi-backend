const PenjualanService = require("../services/penjualanService");
const ProdukPenjualanService = require("../services/produkPenjualanService");

class PenjualanController {

    static async create(req, res) {
        try {
            const { produk, ...penjualanData } = req.body;

            // Create the penjualan record  
            const penjualan = await PenjualanService.create(penjualanData);

            let createdProdukPenjualan = [];
            if (produk && Array.isArray(produk)) {
                // Iterate over each product and create produk_penjualan records  
                for (const item of produk) {
                    const produkPenjualan = await ProdukPenjualanService.create({
                        barang_id: item.barang_id,
                        kuantitas: item.kuantitas,
                        total_biaya: item.total_biaya,
                        penjualan_id: penjualan.penjualan_id  
                    });
                    createdProdukPenjualan.push(produkPenjualan);
                }
            }

            res.status(201).json({
                success: true,
                data: {
                    penjualan,
                    produk: createdProdukPenjualan
                },
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

    static async getById(req, res) {
        try {
            const penjualan = await PenjualanService.getById(req.params.id);
            if (!penjualan) {
                return res.status(404).json({
                    success: false,
                    data: null,
                    message: "not found",
                });
            }
            res.status(200).json({
                success: true,
                data: penjualan,
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

module.exports = PenjualanController