const ProduksiGudangService = require("../services/produksiGudangService"); 
const fs = require('fs');
const path = require('path');
const multer = require("multer");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "../public/produksiGudang"));
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage: storage });
  
class ProduksiGudangController {  
  static async create(req, res) {  
    try {  
      const produksiData = {
        ...req.body,
        image: req.file ? req.file.filename : null,
      }
      const produksiGudang = await ProduksiGudangService.create(produksiData);  
      res.status(201).json({  
        success: true,  
        data: produksiGudang,  
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
      const produksiGudangs = await ProduksiGudangService.getAll();  
      res.status(200).json({  
        success: true,  
        data: produksiGudangs,  
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
      const produksiGudang = await ProduksiGudangService.getById(req.params.id);  
      if (!produksiGudang) {  
        return res.status(404).json({  
          success: false,  
          data: null,  
          message: "not found",  
        });  
      }  
      res.status(200).json({  
        success: true,  
        data: produksiGudang,  
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
      const produksiGudang = await ProduksiGudangService.update(req.params.id, req.body);  
      if (!produksiGudang) {  
        return res.status(404).json({  
          success: false,  
          data: null,  
          message: "not found",  
        });  
      }  
      res.status(200).json({  
        success: true,  
        data: produksiGudang,  
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
      const deleted = await ProduksiGudangService.delete(req.params.id);  
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
  
module.exports = {ProduksiGudangController, upload};  
