const LaporanKeuanganService = require("../services/laporanKeuanganService");  
  
class LaporanKeuanganController {  
  static async create(req, res) {  
    try {  
      const laporanKeuangan = await LaporanKeuanganService.create(req.body);  
      res.status(201).json({  
        success: true,  
        data: laporanKeuangan,  
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
    const { toko_id, startDate, endDate } = req.query;  
    try {  
      const laporanKeuangans = await LaporanKeuanganService.getAll(toko_id, startDate, endDate);
      res.status(200).json({  
        success: true,  
        data: laporanKeuangans,  
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
      const laporanKeuangan = await LaporanKeuanganService.getById(req.params.id);  
      if (!laporanKeuangan) {  
        return res.status(404).json({  
          success: false,  
          data: null,  
          message: "not found",  
        });  
      }  
      res.status(200).json({  
        success: true,  
        data: laporanKeuangan,  
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
      const laporanKeuangan = await LaporanKeuanganService.update(req.params.id, req.body);  
      if (!laporanKeuangan) {  
        return res.status(404).json({  
          success: false,  
          data: null,  
          message: "not found",  
        });  
      }  
      res.status(200).json({  
        success: true,  
        data: laporanKeuangan,  
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
      const deleted = await LaporanKeuanganService.delete(req.params.id);  
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
  
module.exports = LaporanKeuanganController;  
