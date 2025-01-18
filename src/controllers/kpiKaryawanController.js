const KpiKaryawanService = require("../services/kpiKaryawanService");  
  
class KpiKaryawanController {  
  static async create(req, res) {  
    try {  
      const kpiKaryawan = await KpiKaryawanService.create(req.body);  
      res.status(201).json({  
        success: true,  
        data: kpiKaryawan,  
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
      const { bulan, tahun } = req.params;
      const kpiKaryawans = await KpiKaryawanService.getAll(bulan, tahun);  
      res.status(200).json({  
        success: true,  
        data: kpiKaryawans,  
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
      const kpiKaryawan = await KpiKaryawanService.getById(req.params);  
      if (!kpiKaryawan) {  
        return res.status(404).json({  
          success: false,  
          data: null,  
          message: "not found",  
        });  
      }  
      res.status(200).json({  
        success: true,  
        data: kpiKaryawan,  
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
      const kpiKaryawan = await KpiKaryawanService.update(req.params.id, req.body);  
      if (!kpiKaryawan) {  
        return res.status(404).json({  
          success: false,  
          data: null,  
          message: "not found",  
        });  
      }  
      res.status(200).json({  
        success: true,  
        data: kpiKaryawan,  
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
      const deleted = await KpiKaryawanService.delete(req.params.id);  
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
  
  static async getByKaryawanId(req, res) {
    try {
      const { id, bulan, tahun } = req.params;
      const karyawan = await KpiKaryawanService.getByKaryawanId(id, bulan, tahun);
      if (!karyawan) {
        return res.status(404).json({
          success: false,
          data: null,
          message: "not found",
        });
      }
      res.status(200).json({
        success: true,
        data: karyawan,
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
  
module.exports = KpiKaryawanController;  
