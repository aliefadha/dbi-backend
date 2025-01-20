const ProdukPenjualanGudangService = require("../services/produkPenjualanGudangService");  
  
class ProdukPenjualanGudangController {  
  static async create(req, res) {  
    try {  
      const produkPenjualanGudang = await ProdukPenjualanGudangService.create(req.body);  
      res.status(201).json({  
        success: true,  
        data: produkPenjualanGudang,  
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
      const produkPenjualanGudangs = await ProdukPenjualanGudangService.getAll();  
      res.status(200).json({  
        success: true,  
        data: produkPenjualanGudangs,  
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
      const produkPenjualanGudang = await ProdukPenjualanGudangService.getById(req.params.id);  
      if (!produkPenjualanGudang) {  
        return res.status(404).json({  
          success: false,  
          data: null,  
          message: "not found",  
        });  
      }  
      res.status(200).json({  
        success: true,  
        data: produkPenjualanGudang,  
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
      const produkPenjualanGudang = await ProdukPenjualanGudangService.update(req.params.id, req.body);  
      if (!produkPenjualanGudang) {  
        return res.status(404).json({  
          success: false,  
          data: null,  
          message: "not found",  
        });  
      }  
      res.status(200).json({  
        success: true,  
        data: produkPenjualanGudang,  
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
      const deleted = await ProdukPenjualanGudangService.delete(req.params.id);  
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
  
module.exports = ProdukPenjualanGudangController;  
