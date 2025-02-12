const DeskripsiPengeluaranService = require("../services/deskripsiPengeluaranService");  
  
class DeskripsiPengeluaranController {  
  static async create(req, res) {  
    try {  
      const deskripsiPengeluaran = await DeskripsiPengeluaranService.create(req.body);  
      res.status(201).json({  
        success: true,  
        data: deskripsiPengeluaran,  
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
      const deskripsiPengeluarans = await DeskripsiPengeluaranService.getAll();  
      res.status(200).json({  
        success: true,  
        data: deskripsiPengeluarans,  
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
      const deskripsiPengeluaran = await DeskripsiPengeluaranService.getById(req.params.id);  
      if (!deskripsiPengeluaran) {  
        return res.status(404).json({  
          success: false,  
          data: null,  
          message: "not found",  
        });  
      }  
      res.status(200).json({  
        success: true,  
        data: deskripsiPengeluaran,  
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
      const deskripsiPengeluaran = await DeskripsiPengeluaranService.update(req.params.id, req.body);  
      if (!deskripsiPengeluaran) {  
        return res.status(404).json({  
          success: false,  
          data: null,  
          message: "not found",  
        });  
      }  
      res.status(200).json({  
        success: true,  
        data: deskripsiPengeluaran,  
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
      const deleted = await DeskripsiPengeluaranService.delete(req.params.id);  
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
  
module.exports = DeskripsiPengeluaranController;  
