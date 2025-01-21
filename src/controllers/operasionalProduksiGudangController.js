const OperasionalProduksiGudangService = require("../services/operasionalProduksiGudangService");  
  
class OperasionalProduksiGudangController {  
  static async create(req, res) {  
    try {  
      const operasionalProduksiGudang = await OperasionalProduksiGudangService.create(req.body);  
      res.status(201).json({  
        success: true,  
        data: operasionalProduksiGudang,  
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
      const operasionalProduksiGudangs = await OperasionalProduksiGudangService.getAll();  
      res.status(200).json({  
        success: true,  
        data: operasionalProduksiGudangs,  
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
      const operasionalProduksiGudang = await OperasionalProduksiGudangService.getById(req.params.id);  
      if (!operasionalProduksiGudang) {  
        return res.status(404).json({  
          success: false,  
          data: null,  
          message: "not found",  
        });  
      }  
      res.status(200).json({  
        success: true,  
        data: operasionalProduksiGudang,  
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
      const operasionalProduksiGudang = await OperasionalProduksiGudangService.update(req.params.id, req.body);  
      if (!operasionalProduksiGudang) {  
        return res.status(404).json({  
          success: false,  
          data: null,  
          message: "not found",  
        });  
      }  
      res.status(200).json({  
        success: true,  
        data: operasionalProduksiGudang,  
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
      const deleted = await OperasionalProduksiGudangService.delete(req.params.id);  
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
  
module.exports = OperasionalProduksiGudangController;  
