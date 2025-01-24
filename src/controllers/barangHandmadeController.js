const BarangHandmadeService = require("../services/barangHandmadeService");  
const multer = require("multer");
const path = require("path");
const fs = require('fs');
const CustomIdGenerateService = require("../services/customIdGenerateService");

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, "../public/barangHandmade"));
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname));
    },
});

const upload = multer({ storage: storage });

class BarangHandmadeController {  
  static async create(req, res) {  
    try {  
      const newId = await CustomIdGenerateService.generateBarangHandmadeId();
      const barangHandmadeData = {
        ...req.body,  
        image: req.file.filename,  
        barang_handmade_id: newId,  
        jenis_barang_id: 1,
      }
      const barangHandmade = await BarangHandmadeService.create(barangHandmadeData);  
      res.status(201).json({  
        success: true,  
        data: barangHandmade,  
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
      const barangHandmades = await BarangHandmadeService.getAll();  
      res.status(200).json({  
        success: true,  
        data: barangHandmades,  
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
      const barangHandmade = await BarangHandmadeService.getById(req.params.id);  
      if (!barangHandmade) {  
        return res.status(404).json({  
          success: false,  
          data: null,  
          message: "not found",  
        });  
      }  
      res.status(200).json({  
        success: true,  
        data: barangHandmade,  
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
      const barangHandmade = await BarangHandmadeService.update(req.params.id, req.body);  
      if (!barangHandmade) {  
        return res.status(404).json({  
          success: false,  
          data: null,  
          message: "not found",  
        });  
      }  
      res.status(200).json({  
        success: true,  
        data: barangHandmade,  
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
      const deleted = await BarangHandmadeService.delete(req.params.id);  
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
  
module.exports = {BarangHandmadeController, upload};  
