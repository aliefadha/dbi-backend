const BarangNonHandmadeService = require("../services/barangNonHandmadeService");  
const multer = require("multer");
const path = require("path");
const fs = require('fs');
const CustomIdGenerateService = require("../services/customIdGenerateService");

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, "../public/barangNonHandmade"));
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname));
    },
});

const upload = multer({ storage: storage });
  
class BarangNonHandmadeController {  
  static async create(req, res) {  
    try {  
      const newId = await CustomIdGenerateService.generateBarangNonHandmadeId();
      const barangNonHandmadeData = {
        ...req.body,
        image: req.file.filename,
        barang_non_handmade_id: newId,
        jenis_barang_id: 2
      }
      console.log(req.body);
      const barangNonHandmade = await BarangNonHandmadeService.create(barangNonHandmadeData);  
      res.status(201).json({  
        success: true,  
        data: barangNonHandmade,  
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
      const { toko_id, cabang } = req.query;
      const barangNonHandmades = await BarangNonHandmadeService.getAll(toko_id, cabang);  
      res.status(200).json({  
        success: true,  
        data: barangNonHandmades,  
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
      const barangNonHandmade = await BarangNonHandmadeService.getById(req.params.id);  
      if (!barangNonHandmade) {  
        return res.status(404).json({  
          success: false,  
          data: null,  
          message: "not found",  
        });  
      }  
      res.status(200).json({  
        success: true,  
        data: barangNonHandmade,  
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
      const existingBarangNonHandmade = await BarangNonHandmadeService.getById(req.params.id);  
      if (!existingBarangNonHandmade) {  
        return res.status(404).json({  
          success: false,  
          data: null,  
          message: "not found",  
        });  
      }
      const updatedData = { ...req.body };
      if (req.file) {
        // Delete the old image file
        const oldImagePath = path.join(__dirname, "../public/barangNonHandmade", existingBarangNonHandmade.image);
        fs.unlink(oldImagePath, (err) => {
          console.error("Failed to delete old image:", err);
        });
        updatedData.image = req.file.filename;
      }
      const barangNonHandmade = await BarangNonHandmadeService.update(req.params.id, updatedData);  
      if (!barangNonHandmade) {  
        return res.status(404).json({  
          success: false,  
          data: null,  
          message: "not found",  
        });  
      }  
      res.status(200).json({  
        success: true,  
        data: barangNonHandmade,  
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
      const deleted = await BarangNonHandmadeService.delete(req.params.id);  
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
  
module.exports = {BarangNonHandmadeController, upload};  
