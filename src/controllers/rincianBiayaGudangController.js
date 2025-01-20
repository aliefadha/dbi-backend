const RincianBiayaGudangService = require("../services/rincianBiayaGudangService");  
  
class RincianBiayaGudangController {  
  static async create(req, res) {  
    try {  
      const rincianBiayaGudang = await RincianBiayaGudangService.create(req.body);  
      res.status(201).json({  
        success: true,  
        data: rincianBiayaGudang,  
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
      const rincianBiayaGudangs = await RincianBiayaGudangService.getAll();  
      res.status(200).json({  
        success: true,  
        data: rincianBiayaGudangs,  
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
      const rincianBiayaGudang = await RincianBiayaGudangService.getById(req.params.id);  
      if (!rincianBiayaGudang) {  
        return res.status(404).json({  
          success: false,  
          data: null,  
          message: "not found",  
        });  
      }  
      res.status(200).json({  
        success: true,  
        data: rincianBiayaGudang,  
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
      const rincianBiayaGudang = await RincianBiayaGudangService.update(req.params.id, req.body);  
      if (!rincianBiayaGudang) {  
        return res.status(404).json({  
          success: false,  
          data: null,  
          message: "not found",  
        });  
      }  
      res.status(200).json({  
        success: true,  
        data: rincianBiayaGudang,  
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
      const deleted = await RincianBiayaGudangService.delete(req.params.id);  
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
  
module.exports = RincianBiayaGudangController;  
