const RincianBiayaCustomService = require("../services/rincianBiayaCustomService");  
  
class RincianBiayaCustomController {  
  static async create(req, res) {  
    try {  
      const rincianBiayaCustom = await RincianBiayaCustomService.create(req.body);  
      res.status(201).json({  
        success: true,  
        data: rincianBiayaCustom,  
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
      const rincianBiayaCustoms = await RincianBiayaCustomService.getAll();  
      res.status(200).json({  
        success: true,  
        data: rincianBiayaCustoms,  
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
      const rincianBiayaCustom = await RincianBiayaCustomService.getById(req.params.id);  
      if (!rincianBiayaCustom) {  
        return res.status(404).json({  
          success: false,  
          data: null,  
          message: "not found",  
        });  
      }  
      res.status(200).json({  
        success: true,  
        data: rincianBiayaCustom,  
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
      const rincianBiayaCustom = await RincianBiayaCustomService.update(req.params.id, req.body);  
      if (!rincianBiayaCustom) {  
        return res.status(404).json({  
          success: false,  
          data: null,  
          message: "not found",  
        });  
      }  
      res.status(200).json({  
        success: true,  
        data: rincianBiayaCustom,  
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
      const deleted = await RincianBiayaCustomService.delete(req.params.id);  
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
  
module.exports = RincianBiayaCustomController;  
