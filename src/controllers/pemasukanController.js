const CustomIdGenerateService = require("../services/customIdGenerateService");
const DeskripsiPemasukanService = require("../services/deskripsiPemasukanService");
const PemasukanService = require("../services/pemasukanService");  
  
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
    try {
      const pemasukans = await PemasukanService.getByKategori(req.params.kategori_id);
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
}  
  
module.exports = PemasukanController;  
