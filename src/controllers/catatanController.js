const CatatanService = require("../services/catatanService");  
const XLSX = require('xlsx');
class CatatanController {  
  static async create(req, res) {  
    try {  
      const catatan = await CatatanService.create(req.body);  
      res.status(201).json({  
        success: true,  
        data: catatan,  
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
      const { bulan, tahun, toko_id} = req.query;
      const catatans = await CatatanService.getAll(bulan, tahun, toko_id);  
      res.status(200).json({  
        success: true,  
        data: catatans,  
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
      const catatan = await CatatanService.getById(req.params.id);  
      if (!catatan) {  
        return res.status(404).json({  
          success: false,  
          data: null,  
          message: "not found",  
        });  
      }  
      res.status(200).json({  
        success: true,  
        data: catatan,  
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
      const catatan = await CatatanService.update(req.params.id, req.body);  
      if (!catatan) {  
        return res.status(404).json({  
          success: false,  
          data: null,  
          message: "not found",  
        });  
      }  
      res.status(200).json({  
        success: true,  
        data: catatan,  
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
      const deleted = await CatatanService.delete(req.params.id);  
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

  static async export(req, res){
    try {
      const { bulan, tahun } = req.query;
      const workbook = await CatatanService.exportToExcel(bulan, tahun);
      res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
      res.setHeader("Content-Disposition", "attachment; filename=catatan.xlsx");
      const buffer = XLSX.write(workbook, { type: "buffer", bookType: "xlsx" });
      res.send(buffer);
    } catch (error) {
      console.error("Error exporting to Excel:", error);  
      res.status(500).json({
        success: false,
        data: null,
        message: error.message
      })
    }
  }
}  
  
module.exports = CatatanController;  
