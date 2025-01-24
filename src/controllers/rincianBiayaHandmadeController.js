const RincianBiayaHandmadeService = require("../services/rincianBiayaHandmadeService");  
  
class RincianBiayaHandmadeController {  
  static async create(req, res) {  
    try {  
      const rincianBiayaHandmade = await RincianBiayaHandmadeService.create(req.body);  
      res.status(201).json({  
        success: true,  
        data: rincianBiayaHandmade,  
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
      const rincianBiayaHandmades = await RincianBiayaHandmadeService.getAll();  
      res.status(200).json({  
        success: true,  
        data: rincianBiayaHandmades,  
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
      const rincianBiayaHandmade = await RincianBiayaHandmadeService.getById(req.params.id);  
      if (!rincianBiayaHandmade) {  
        return res.status(404).json({  
          success: false,  
          data: null,  
          message: "not found",  
        });  
      }  
      res.status(200).json({  
        success: true,  
        data: rincianBiayaHandmade,  
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
      const rincianBiayaHandmade = await RincianBiayaHandmadeService.update(req.params.id, req.body);  
      if (!rincianBiayaHandmade) {  
        return res.status(404).json({  
          success: false,  
          data: null,  
          message: "not found",  
        });  
      }  
      res.status(200).json({  
        success: true,  
        data: rincianBiayaHandmade,  
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
      const deleted = await RincianBiayaHandmadeService.delete(req.params.id);  
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
  
module.exports = RincianBiayaHandmadeController;  
