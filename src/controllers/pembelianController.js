const PembelianService = require("../services/pembelianService");
const ProdukPembelianService = require("../services/produkPembelianService");

class PembelianController {
  static async create(req, res) {
    try {  
      const { pembelian, ...pembelianData } = req.body;

      const pembelianRecord = await PembelianService.create(pembelianData);
      let createdProdukPembelian = [];

      if (pembelian && Array.isArray(pembelian)) {
        for (const { cabang_id, produk } of pembelian) {
          if (cabang_id && Array.isArray(produk)) {
            for (const { barang_id, kuantitas, total_biaya } of produk) {
              const produkPembelian = await ProdukPembelianService.create({
                pembelian_id: pembelianRecord.pembelian_id,
                barang_id,
                kuantitas,
                total_biaya,
                cabang_id
              });
              createdProdukPembelian.push(produkPembelian);
            }
          }
        }
      }

      res.status(201).json({
        success: true,
        data: {
          pembelian: pembelianRecord,
          produkPembelian: createdProdukPembelian
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
      const pembelians = await PembelianService.getAll();
      res.status(200).json({
        success: true,
        data: pembelians,
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

  static async getProduk(id) {
    try {
      const pembelians = await PembelianService.getProdukPembelian(id);
      res.status(200).json({
        success: true,
        data: pembelians,
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
      const pembelian = await PembelianService.getById(req.params.id);
      if (!pembelian) {
        return res.status(404).json({
          success: false,
          data: null,
          message: "not found",
        });
      }
      res.status(200).json({
        success: true,
        data: pembelian,
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
      const pembelian = await PembelianService.update(req.params.id, req.body);
      if (!pembelian) {
        return res.status(404).json({
          success: false,
          data: null,
          message: "not found",
        });
      }
      res.status(200).json({
        success: true,
        data: pembelian,
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
      const deleted = await PembelianService.delete(req.params.id);
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
}

module.exports = PembelianController;  
