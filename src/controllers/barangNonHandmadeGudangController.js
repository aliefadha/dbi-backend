const BarangNonHandmadeGudangService = require("../services/barangNonHandmadeGudangService");  
  
class BarangNonHandmadeGudangController {  
  static async create(req, res) {  
    try {  
      const barangNonHandmadeGudang = await BarangNonHandmadeGudangService.create(req.body);  
      res.status(201).json({  
        success: true,  
        data: barangNonHandmadeGudang,  
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
      const barangNonHandmadeGudangs = await BarangNonHandmadeGudangService.getAll();  
      res.status(200).json({  
        success: true,  
        data: barangNonHandmadeGudangs,  
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
      const barangNonHandmadeGudang = await BarangNonHandmadeGudangService.getById(req.params.id);  
      if (!barangNonHandmadeGudang) {  
        return res.status(404).json({  
          success: false,  
          data: null,  
          message: "not found",  
        });  
      }  
      res.status(200).json({  
        success: true,  
        data: barangNonHandmadeGudang,  
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
      const barangNonHandmadeGudang = await BarangNonHandmadeGudangService.update(req.params.id, req.body);  
      if (!barangNonHandmadeGudang) {  
        return res.status(404).json({  
          success: false,  
          data: null,  
          message: "not found",  
        });  
      }  
      res.status(200).json({  
        success: true,  
        data: barangNonHandmadeGudang,  
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
      const deleted = await BarangNonHandmadeGudangService.delete(req.params.id);  
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
  
module.exports = BarangNonHandmadeGudangController;  
