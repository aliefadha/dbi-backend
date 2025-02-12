const CustomIdGenerateService = require("../services/customIdGenerateService");
const PengeluaranService = require("../services/pengeluaranService");  
  
class PengeluaranController {  
  static async create(req, res) {  
    try {  
      const newId = await CustomIdGenerateService.generatePengeluaranId();
      const pengeluaranData = {
        ...req.body,
        pengeluaran_id: newId
      }
      const pengeluaran = await PengeluaranService.create(pengeluaranData);  
      res.status(201).json({  
        success: true,  
        data: pengeluaran,  
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
      const pengeluarans = await PengeluaranService.getAll();  
      res.status(200).json({  
        success: true,  
        data: pengeluarans,  
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
      const pengeluaran = await PengeluaranService.getById(req.params.id);  
      if (!pengeluaran) {  
        return res.status(404).json({  
          success: false,  
          data: null,  
          message: "not found",  
        });  
      }  
      res.status(200).json({  
        success: true,  
        data: pengeluaran,  
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
      const pengeluaran = await PengeluaranService.update(req.params.id, req.body);  
      if (!pengeluaran) {  
        return res.status(404).json({  
          success: false,  
          data: null,  
          message: "not found",  
        });  
      }  
      res.status(200).json({  
        success: true,  
        data: pengeluaran,  
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
      const deleted = await PengeluaranService.delete(req.params.id);  
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
  
module.exports = PengeluaranController;  
