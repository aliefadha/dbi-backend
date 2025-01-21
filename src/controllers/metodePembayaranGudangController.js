const MetodePembayaranGudangService = require("../services/metodePembayaranGudangService");  
  
class MetodePembayaranGudangController {  
  static async create(req, res) {  
    try {  
      const metodePembayaranGudang = await MetodePembayaranGudangService.create(req.body);  
      res.status(201).json({  
        success: true,  
        data: metodePembayaranGudang,  
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
      const metodePembayaranGudangs = await MetodePembayaranGudangService.getAll();  
      res.status(200).json({  
        success: true,  
        data: metodePembayaranGudangs,  
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
      const metodePembayaranGudang = await MetodePembayaranGudangService.getById(req.params.id);  
      if (!metodePembayaranGudang) {  
        return res.status(404).json({  
          success: false,  
          data: null,  
          message: "not found",  
        });  
      }  
      res.status(200).json({  
        success: true,  
        data: metodePembayaranGudang,  
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
      const metodePembayaranGudang = await MetodePembayaranGudangService.update(req.params.id, req.body);  
      if (!metodePembayaranGudang) {  
        return res.status(404).json({  
          success: false,  
          data: null,  
          message: "not found",  
        });  
      }  
      res.status(200).json({  
        success: true,  
        data: metodePembayaranGudang,  
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
      const deleted = await MetodePembayaranGudangService.delete(req.params.id);  
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
  
module.exports = MetodePembayaranGudangController;  
