const ProdukPembelianGudangService = require("../services/produkPembelianGudangService");  
  
class ProdukPembelianGudangController {  
  static async create(req, res) {  
    try {  
      const produkPembelianGudang = await ProdukPembelianGudangService.create(req.body);  
      res.status(201).json({  
        success: true,  
        data: produkPembelianGudang,  
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
      const produkPembelianGudangs = await ProdukPembelianGudangService.getAll();  
      res.status(200).json({  
        success: true,  
        data: produkPembelianGudangs,  
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
      const produkPembelianGudang = await ProdukPembelianGudangService.getById(req.params.id);  
      if (!produkPembelianGudang) {  
        return res.status(404).json({  
          success: false,  
          data: null,  
          message: "not found",  
        });  
      }  
      res.status(200).json({  
        success: true,  
        data: produkPembelianGudang,  
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
      const produkPembelianGudang = await ProdukPembelianGudangService.update(req.params.id, req.body);  
      if (!produkPembelianGudang) {  
        return res.status(404).json({  
          success: false,  
          data: null,  
          message: "not found",  
        });  
      }  
      res.status(200).json({  
        success: true,  
        data: produkPembelianGudang,  
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
      const deleted = await ProdukPembelianGudangService.delete(req.params.id);  
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
  
module.exports = ProdukPembelianGudangController;  
