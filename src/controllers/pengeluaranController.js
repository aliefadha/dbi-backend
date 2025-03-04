const CustomIdGenerateService = require("../services/customIdGenerateService");
const PengeluaranService = require("../services/pengeluaranService");  
const XLSX = require('xlsx');
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
    const { startDate, endDate, kategori_pengeluaran_id, cash_or_non } = req.query; 
    try {  
      const pengeluarans = await PengeluaranService.getAll(startDate, endDate, kategori_pengeluaran_id, cash_or_non);  
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

  static async getByKategori(req, res) {
    const { startDate, endDate } = req.query; 
    try {
      const pengeluarans = await PengeluaranService.getByKategori(req.params.kategori_id, startDate, endDate);
      if (!pengeluarans) {
        return res.status(404).json({
          success: false,
          data: null,
          message: "not found",
        });
      }
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

  static async getByToko(req, res) {
    const { startDate, endDate } = req.query; 
    try {
      const pengeluarans = await PengeluaranService.getByToko(req.params.toko_id, startDate, endDate);
      if (!pengeluarans) {
        return res.status(404).json({
          success: false,
          data: null,
          message: "not found",
        });
      }
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

  static async export(req, res) {  
    try {  
      const { startDate, endDate, kategori_pengeluaran_id, cash_or_non } = req.query;  
      const workbook = await PengeluaranService.exportToExcel(startDate, endDate, kategori_pengeluaran_id, cash_or_non);  
      res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");  
      res.setHeader("Content-Disposition", "attachment; filename=pengeluaran.xlsx");  
      const buffer = XLSX.write(workbook, { type: "buffer", bookType: "xlsx" });  
      res.send(buffer);  
    } catch (error) {  
      console.error("Error exporting to Excel:", error);  
      res.status(500).json({  
        success: false,  
        data: null,  
        message: error.message,  
      });  
    }  
  }
}  
  
module.exports = PengeluaranController;
