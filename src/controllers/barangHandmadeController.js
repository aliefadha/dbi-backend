const BarangHandmadeService = require("../services/barangHandmadeService");  
  
class BarangHandmadeController {  
  static async create(req, res) {  
    try {  
      const barangHandmade = await BarangHandmadeService.create(req.body);  
      res.status(201).json({  
        success: true,  
        data: barangHandmade,  
        message: "BarangHandmade created successfully",  
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
      const barangHandmades = await BarangHandmadeService.getAll();  
      res.status(200).json({  
        success: true,  
        data: barangHandmades,  
        message: "BarangHandmades retrieved successfully",  
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
      const barangHandmade = await BarangHandmadeService.getById(req.params.id);  
      if (!barangHandmade) {  
        return res.status(404).json({  
          success: false,  
          data: null,  
          message: "BarangHandmade not found",  
        });  
      }  
      res.status(200).json({  
        success: true,  
        data: barangHandmade,  
        message: "BarangHandmade retrieved successfully",  
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
      const barangHandmade = await BarangHandmadeService.update(req.params.id, req.body);  
      if (!barangHandmade) {  
        return res.status(404).json({  
          success: false,  
          data: null,  
          message: "BarangHandmade not found",  
        });  
      }  
      res.status(200).json({  
        success: true,  
        data: barangHandmade,  
        message: "BarangHandmade updated successfully",  
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
      const deleted = await BarangHandmadeService.delete(req.params.id);  
      if (!deleted) {  
        return res.status(404).json({  
          success: false,  
          data: null,  
          message: "BarangHandmade not found",  
        });  
      }  
      res.status(200).json({  
        success: true,  
        data: null,  
        message: "BarangHandmade deleted successfully",  
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
  
module.exports = BarangHandmadeController;  
