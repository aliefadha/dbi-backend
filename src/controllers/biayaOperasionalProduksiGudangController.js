const BiayaOperasionalProduksiGudangService = require("../services/biayaOperasionalProduksiGudangService");  
  
class BiayaOperasionalProduksiGudangController {  
  static async create(req, res) {  
    try {  
      const biayaOperasionalProduksiGudang = await BiayaOperasionalProduksiGudangService.create(req.body);  
      res.status(201).json({  
        success: true,  
        data: biayaOperasionalProduksiGudang,  
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
      const biayaOperasionalProduksiGudangs = await BiayaOperasionalProduksiGudangService.getAll();  
      res.status(200).json({  
        success: true,  
        data: biayaOperasionalProduksiGudangs,  
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
      const biayaOperasionalProduksiGudang = await BiayaOperasionalProduksiGudangService.getById(req.params.id);  
      if (!biayaOperasionalProduksiGudang) {  
        return res.status(404).json({  
          success: false,  
          data: null,  
          message: "not found",  
        });  
      }  
      res.status(200).json({  
        success: true,  
        data: biayaOperasionalProduksiGudang,  
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
      const biayaOperasionalProduksiGudang = await BiayaOperasionalProduksiGudangService.update(req.params.id, req.body);  
      if (!biayaOperasionalProduksiGudang) {  
        return res.status(404).json({  
          success: false,  
          data: null,  
          message: "not found",  
        });  
      }  
      res.status(200).json({  
        success: true,  
        data: biayaOperasionalProduksiGudang,  
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
      const deleted = await BiayaOperasionalProduksiGudangService.delete(req.params.id);  
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
  
module.exports = BiayaOperasionalProduksiGudangController;  
