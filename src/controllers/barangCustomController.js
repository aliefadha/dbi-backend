const BarangCustomService = require("../services/barangCustomService");  
const multer = require("multer");
const path = require("path");
const fs = require('fs');
const CustomIdGenerateService = require("../services/customIdGenerateService");

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, "../public/barangCustom"));
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname));
    },
});

const upload = multer({ storage: storage });
  
class BarangCustomController {  
  static async create(req, res) {  
    try {  
      const newId = await CustomIdGenerateService.generateBarangCustomId();
      const barangCustomData = {
        ...req.body,
        image: req.file.filename,
        barang_custom_id: newId,
        jenis_barang_id: 3
      }
      const barangCustom = await BarangCustomService.create(barangCustomData);  
      res.status(201).json({  
        success: true,  
        data: barangCustom,  
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
      const { toko_id, page, limit, search, category } = req.query;
      const currentPage = parseInt(page) || 1;
      const itemsPerPage = parseInt(limit) || 10;
      const searchItem = search || '';

      const result = await BarangCustomService.getAll(
        toko_id,
        currentPage,
        itemsPerPage,
        searchItem,
        category
      )
      res.status(200).json({
        success: true,
        data: result.data,
        pagination: { // Add pagination metadata
          totalItems: result.totalItems,
          currentPage: result.currentPage,
          totalPages: result.totalPages,
          itemsPerPage: itemsPerPage
        },
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
      const barangCustom = await BarangCustomService.getById(req.params.id);  
      if (!barangCustom) {  
        return res.status(404).json({  
          success: false,  
          data: null,  
          message: "not found",  
        });  
      }  
      res.status(200).json({  
        success: true,  
        data: barangCustom,  
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
      const existingBarangCustom = await BarangCustomService.getById(req.params.id);  
      if (!existingBarangCustom) {  
        return res.status(404).json({  
          success: false,  
          data: null,  
          message: "not found",  
        });  
      }
      const updatedData = { ...req.body };

      if (req.file) {
        // Delete the old image file
        const oldImagePath = path.join(__dirname, "../public/barangCustom", existingBarangCustom.image);
        fs.unlink(oldImagePath, (err) => {
          if (err) {
            console.error("Failed to delete old image:", err);
          }
        });
        updatedData.image = req.file.filename;
      }
      const barangCustom = await BarangCustomService.update(req.params.id, updatedData);  
      if (!barangCustom) {  
        return res.status(404).json({  
          success: false,  
          data: null,  
          message: "not found",  
        });  
      }  
      res.status(200).json({  
        success: true,  
        data: barangCustom,  
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
      const deleted = await BarangCustomService.delete(req.params.id);  
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
  
module.exports = {BarangCustomController, upload};  
