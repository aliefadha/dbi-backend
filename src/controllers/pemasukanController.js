const CustomIdGenerateService = require("../services/customIdGenerateService");
const DeskripsiPemasukanService = require("../services/deskripsiPemasukanService");
const PemasukanService = require("../services/pemasukanService");  
const XLSX = require('xlsx');
class PemasukanController {  
  static async create(req, res) {  
    try {  
      const newId = await CustomIdGenerateService.generatePemasukanId();
      const pemasukanData = {
        ...req.body,
       pemasukan_id: newId,
      }
      const pemasukan = await PemasukanService.create(pemasukanData);  
      res.status(201).json({  
        success: true,  
        data: pemasukan,  
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
    const { startDate, endDate } = req.query; 
    try {  
      const pemasukans = await PemasukanService.getAll(startDate, endDate);  
      res.status(200).json({  
        success: true,  
        data: pemasukans,  
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
      const pemasukan = await PemasukanService.getById(req.params.id);  
      if (!pemasukan) {  
        return res.status(404).json({  
          success: false,  
          data: null,  
          message: "not found",  
        });  
      }  
      res.status(200).json({  
        success: true,  
        data: pemasukan,  
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
      const pemasukans = await PemasukanService.getByKategori(req.params.kategori_id, startDate, endDate);
      if (!pemasukans) {
        return res.status(404).json({
          success: false,
          data: null,
          message: "not found",
        });
      }
      res.status(200).json({
        success: true,
        data: pemasukans,
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
      const pemasukans = await PemasukanService.getByToko(req.params.toko_id, startDate, endDate);
      if (!pemasukans) {
        return res.status(404).json({
          success: false,
          data: null,
          message: "not found",
        });
      }
      res.status(200).json({
        success: true,
        data: pemasukans,
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

  static async getByCashOrNon(req, res) {
    const { startDate, endDate } = req.query; 
    try {
      const pemasukans = await PemasukanService.getByCashOrNon(req.params.is_cash, startDate, endDate);
      if (!pemasukans) {
        return res.status(404).json({
          success: false,
          data: null,
          message: "not found",
        });
      }
      res.status(200).json({
        success: true,
        data: pemasukans,
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
      const pemasukan = await PemasukanService.update(req.params.id, req.body);  
      if (!pemasukan) {  
        return res.status(404).json({  
          success: false,  
          data: null,  
          message: "not found",  
        });  
      }  
      res.status(200).json({  
        success: true,  
        data: pemasukan,  
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
      const deleted = await PemasukanService.delete(req.params.id);  
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
    try{
      const { startDate, endDate } = req.query; 
      const workbook = await PemasukanService.exportToExcel(startDate, endDate);
      res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
      res.setHeader('Content-Disposition', 'attachment; filename=pemasukan.xlsx');
      const buffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });
      res.send(buffer);
    } catch (error) {
      console.error('Error exporting to Excel:', error);
      res.status(500).json({
        success: false,
        data: null,
        message: error.message
      });
    }
  }
}  
  
module.exports = PemasukanController;  
