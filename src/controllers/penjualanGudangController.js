const PenjualanGudangService = require("../services/penjualanGudangService");  
const CustomIdGenerateService = require("../services/customIdGenerateService");
  
class PenjualanGudangController {  
  static async create(req, res) {

    try {
      const newId = await CustomIdGenerateService.generatePenjualanGudangId();
      const { ...penjualanData } = req.body;


      const penjualanGudang = await PenjualanGudangService.create({
        ...penjualanData,
        penjualan_id: newId
      });

      res.status(201).json({
        success: true,
        data: {
          penjualan: penjualanGudang,
        },
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
      const penjualanGudangs = await PenjualanGudangService.getAll();  
      res.status(200).json({  
        success: true,  
        data: penjualanGudangs,  
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
      const penjualanGudang = await PenjualanGudangService.getById(req.params.id);  
      if (!penjualanGudang) {  
        return res.status(404).json({  
          success: false,  
          data: null,  
          message: "not found",  
        });  
      }  
      res.status(200).json({  
        success: true,  
        data: penjualanGudang,  
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

  static async getAllByDate(req, res) {
    const { startDate, endDate } = req.query;
    try {
      const penjualanGudang = await PenjualanGudangService.getAllByDate(startDate, endDate);
      res.status(200).json({
        success: true,
        data: penjualanGudang,
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
      const { ...penjualanData } = req.body;

      const penjualanGudang = await PenjualanGudangService.update(req.params.id, penjualanData);
      if (!penjualanGudang) {
        return res.status(404).json({
          success: false,
          data: null,
          message: "not found",
        });
      }
      res.status(200).json({
        success: true,
        data: {
          penjualan: penjualanGudang,
        },
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
      const deleted = await PenjualanGudangService.delete(req.params.id);  
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
  
module.exports = PenjualanGudangController;
