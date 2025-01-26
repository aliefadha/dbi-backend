const sequelize = require("../config/database")
const PenjualanGudangService = require("../services/penjualanGudangService");  
const ProdukPenjualanGudangService = require("../services/produkPenjualanGudangService");
  
class PenjualanGudangController {  
  static async create(req, res) {
    let transaction;

    try {
      const { produk, ...penjualanData } = req.body;

      if (!produk || produk.length === 0) {
        throw new Error("produk kosong");
      }
      transaction = await sequelize.transaction();

      const penjualanGudang = await PenjualanGudangService.create(penjualanData, { transaction });

      const produkToCreate = produk.map((product) => ({
        ...product,
        penjualan_id: penjualanGudang.penjualan_id,
      }));

      const createdProduk = await ProdukPenjualanGudangService.createMany(
        produkToCreate,
        { transaction }
      );

      await transaction.commit();

      res.status(201).json({
        success: true,
        data: {
          penjualan: penjualanGudang,
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
      const penjualanGudangs = await PenjualanGudangService.getAll();  
      res.status(200).json({  
        success: true,  
        data: penjualanGudangs,  
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
      const penjualanGudang = await PenjualanGudangService.getById(req.params.id);  
      if (!penjualanGudang) {  
        return res.status(404).json({  
          success: false,  
          data: null,  
          message: "not found",  
        });  
      }  
      res.status(200).json({  
        success: true,  
        data: penjualanGudang,  
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
      const penjualanGudang = await PenjualanGudangService.update(req.params.id, req.body);  
      if (!penjualanGudang) {  
        return res.status(404).json({  
          success: false,  
          data: null,  
          message: "not found",  
        });  
      }  
      res.status(200).json({  
        success: true,  
        data: penjualanGudang,  
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
      const deleted = await PenjualanGudangService.delete(req.params.id);  
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
  
module.exports = PenjualanGudangController;  
