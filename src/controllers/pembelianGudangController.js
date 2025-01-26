const sequelize = require("../config/database")
const PembelianGudangService = require("../services/pembelianGudangService");
const ProdukPembelianGudangService = require("../services/produkPembelianGudangService");

class PembelianGudangController {
  static async create(req, res) {
    let transaction;
  
    try {
      const { produk, ...pembelianData } = req.body;
  
      if (!produk || produk.length === 0) {
        throw new Error("produk kosong");
      }
      transaction = await sequelize.transaction();
  
      const pembelianGudang = await PembelianGudangService.create(pembelianData, { transaction });
  
      const produkToCreate = produk.map((product) => ({
        ...product,
        pembelian_id: pembelianGudang.pembelian_id,
      }));
  
      const createdProduk = await ProdukPembelianGudangService.createMany(
        produkToCreate, 
        { transaction }
      );
  
      await transaction.commit();
  
      res.status(201).json({
        success: true,
        data: {
          pembelian: pembelianGudang,
          produk: createdProduk,
        },
        message: "created successfully",
      });
  
    } catch (error) {
      if (transaction && !transaction.finished) {
        await transaction.rollback();
      }
  
      res.status(400).json({
        success: false,
        data: null,
        message: error.message,
      });
    }
  }

  static async getAll(req, res) {
    try {
      const pembelianGudangs = await PembelianGudangService.getAll();
      res.status(200).json({
        success: true,
        data: pembelianGudangs,
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
      const pembelianGudang = await PembelianGudangService.getById(req.params.id);
      if (!pembelianGudang) {
        return res.status(404).json({
          success: false,
          data: null,
          message: "not found",
        });
      }
      res.status(200).json({
        success: true,
        data: pembelianGudang,
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
      const pembelianGudang = await PembelianGudangService.update(req.params.id, req.body);
      if (!pembelianGudang) {
        return res.status(404).json({
          success: false,
          data: null,
          message: "not found",
        });
      }
      res.status(200).json({
        success: true,
        data: pembelianGudang,
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
      const deleted = await PembelianGudangService.delete(req.params.id);
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

module.exports = PembelianGudangController;  
