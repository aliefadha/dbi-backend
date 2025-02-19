const BayarGajiService = require("../services/bayarGajiService");  
const CustomIdGenerateService = require("../services/customIdGenerateService");
  
class BayarGajiController {  
  static async create(req, res) {  
    try {  
      const newId = await CustomIdGenerateService.generateBayarGajiId();
      const bayarGajiData = {
        ...req.body,
        bayar_gaji_id: newId
      }
      const bayarGaji = await BayarGajiService.create(bayarGajiData);  
      res.status(201).json({  
        success: true,  
        data: bayarGaji,  
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
      const { bulan, tahun } = req.query;
      const bayarGajis = await BayarGajiService.getAll(bulan, tahun);  
      res.status(200).json({  
        success: true,  
        data: bayarGajis,  
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
      const bayarGaji = await BayarGajiService.getById(req.params.id);  
      if (!bayarGaji) {  
        return res.status(404).json({  
          success: false,  
          data: null,  
          message: "not found",  
        });  
      }  
      res.status(200).json({  
        success: true,  
        data: bayarGaji,  
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
      const bayarGaji = await BayarGajiService.update(req.params.id, req.body);  
      if (!bayarGaji) {  
        return res.status(404).json({  
          success: false,  
          data: null,  
          message: "not found",  
        });  
      }  
      res.status(200).json({  
        success: true,  
        data: bayarGaji,  
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
      const deleted = await BayarGajiService.delete(req.params.id);  
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
  
module.exports = BayarGajiController;  
