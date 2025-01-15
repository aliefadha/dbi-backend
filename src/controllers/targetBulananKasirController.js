const TargetBulananKasirService = require("../services/targetBulananKasirService");  
  
class TargetBulananKasirController {  
  static async create(req, res) {  
    try {  
      const targetBulananKasir = await TargetBulananKasirService.create(req.body);  
      res.status(201).json({  
        success: true,  
        data: targetBulananKasir,  
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
      const targetBulananKasirs = await TargetBulananKasirService.getAll();  
      res.status(200).json({  
        success: true,  
        data: targetBulananKasirs,  
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
      const targetBulananKasir = await TargetBulananKasirService.getById(req.params.id);  
      if (!targetBulananKasir) {  
        return res.status(404).json({  
          success: false,  
          data: null,  
          message: "not found",  
        });  
      }  
      res.status(200).json({  
        success: true,  
        data: targetBulananKasir,  
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
      const targetBulananKasir = await TargetBulananKasirService.update(req.params.id, req.body);  
      if (!targetBulananKasir) {  
        return res.status(404).json({  
          success: false,  
          data: null,  
          message: "not found",  
        });  
      }  
      res.status(200).json({  
        success: true,  
        data: targetBulananKasir,  
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
      const deleted = await TargetBulananKasirService.delete(req.params.id);  
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
  
  static async getTargetByCabang(req, res) {  
    try {  
      const targetBulananKasirs = await TargetBulananKasirService.getTargetByCabang(req.params.id);  
      res.status(200).json({  
        success: true,  
        data: targetBulananKasirs,  
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
}  
  
module.exports = TargetBulananKasirController;  
