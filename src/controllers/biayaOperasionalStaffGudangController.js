const BiayaOperasionalStaffGudangService = require("../services/biayaOperasionalStaffGudangService");  
  
class BiayaOperasionalStaffGudangController {  
  static async create(req, res) {  
    try {  
      const biayaOperasionalStaffGudang = await BiayaOperasionalStaffGudangService.create(req.body);  
      res.status(201).json({  
        success: true,  
        data: biayaOperasionalStaffGudang,  
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
      const biayaOperasionalStaffGudangs = await BiayaOperasionalStaffGudangService.getAll();  
      res.status(200).json({  
        success: true,  
        data: biayaOperasionalStaffGudangs,  
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
      const biayaOperasionalStaffGudang = await BiayaOperasionalStaffGudangService.getById(req.params.id);  
      if (!biayaOperasionalStaffGudang) {  
        return res.status(404).json({  
          success: false,  
          data: null,  
          message: "not found",  
        });  
      }  
      res.status(200).json({  
        success: true,  
        data: biayaOperasionalStaffGudang,  
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
      const biayaOperasionalStaffGudang = await BiayaOperasionalStaffGudangService.update(req.params.id, req.body);  
      if (!biayaOperasionalStaffGudang) {  
        return res.status(404).json({  
          success: false,  
          data: null,  
          message: "not found",  
        });  
      }  
      res.status(200).json({  
        success: true,  
        data: biayaOperasionalStaffGudang,  
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
      const deleted = await BiayaOperasionalStaffGudangService.delete(req.params.id);  
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
  
module.exports = BiayaOperasionalStaffGudangController;  
