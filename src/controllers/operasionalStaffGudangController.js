const OperasionalStaffGudangService = require("../services/operasionalStaffGudangService");  
  
class OperasionalStaffGudangController {  
  static async create(req, res) {  
    try {  
      const operasionalStaffGudang = await OperasionalStaffGudangService.create(req.body);  
      res.status(201).json({  
        success: true,  
        data: operasionalStaffGudang,  
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
      const operasionalStaffGudangs = await OperasionalStaffGudangService.getAll();  
      res.status(200).json({  
        success: true,  
        data: operasionalStaffGudangs,  
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
      const operasionalStaffGudang = await OperasionalStaffGudangService.getById(req.params.id);  
      if (!operasionalStaffGudang) {  
        return res.status(404).json({  
          success: false,  
          data: null,  
          message: "not found",  
        });  
      }  
      res.status(200).json({  
        success: true,  
        data: operasionalStaffGudang,  
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
      const operasionalStaffGudang = await OperasionalStaffGudangService.update(req.params.id, req.body);  
      if (!operasionalStaffGudang) {  
        return res.status(404).json({  
          success: false,  
          data: null,  
          message: "not found",  
        });  
      }  
      res.status(200).json({  
        success: true,  
        data: operasionalStaffGudang,  
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
      const deleted = await OperasionalStaffGudangService.delete(req.params.id);  
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
  
module.exports = OperasionalStaffGudangController;  
