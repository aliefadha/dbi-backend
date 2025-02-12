const DeskripsiPemasukanService = require("../services/deskripsiPemasukanService");  
  
class DeskripsiPemasukanController {  
  static async create(req, res) {  
    try {  
      const deskripsiPemasukan = await DeskripsiPemasukanService.create(req.body);  
      res.status(201).json({  
        success: true,  
        data: deskripsiPemasukan,  
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
      const deskripsiPemasukans = await DeskripsiPemasukanService.getAll();  
      res.status(200).json({  
        success: true,  
        data: deskripsiPemasukans,  
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
      const deskripsiPemasukan = await DeskripsiPemasukanService.getById(req.params.id);  
      if (!deskripsiPemasukan) {  
        return res.status(404).json({  
          success: false,  
          data: null,  
          message: "not found",  
        });  
      }  
      res.status(200).json({  
        success: true,  
        data: deskripsiPemasukan,  
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
      const deskripsiPemasukan = await DeskripsiPemasukanService.update(req.params.id, req.body);  
      if (!deskripsiPemasukan) {  
        return res.status(404).json({  
          success: false,  
          data: null,  
          message: "not found",  
        });  
      }  
      res.status(200).json({  
        success: true,  
        data: deskripsiPemasukan,  
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
      const deleted = await DeskripsiPemasukanService.delete(req.params.id);  
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
  
module.exports = DeskripsiPemasukanController;  
