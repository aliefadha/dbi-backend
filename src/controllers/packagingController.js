const PackagingService = require("../services/packagingService");  
const multer = require("multer");
const path = require("path");
const fs = require('fs');
const CustomIdGenerateService = require("../services/customIdGenerateService");

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, "../public/packaging"));
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname));
    },
});

const upload = multer({ storage: storage });

class PackagingController {  
  static async create(req, res) {  
    try {  
      const newId = await CustomIdGenerateService.generatePackagingId();
      const packagingData = {
        ...req.body,
        image: req.file.filename,
        packaging_id: newId,
        jenis_barang_id: 4,
      }
      const packaging = await PackagingService.create(packagingData);  
      res.status(201).json({  
        success: true,  
        data: packaging,  
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
      const { toko_id, page, limit, search } = req.query;
      const currentPage = parseInt(page) || 1;
      const itemsPerPage = parseInt(limit) || 10;
      const searchItem = search || '';

      const result = await PackagingService.getAll(
        toko_id,
        currentPage,
        itemsPerPage,
        searchItem
      );  
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
      const packaging = await PackagingService.getById(req.params.id);  
      if (!packaging) {  
        return res.status(404).json({  
          success: false,  
          data: null,  
          message: "not found",  
        });  
      }  
      res.status(200).json({  
        success: true,  
        data: packaging,  
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
      const existingPackaging = await PackagingService.getById(req.params.id);
      if (!existingPackaging) {
        return res.status(404).json({
          success: false,
          data: null,
          message: "not found",
        });
      }
      const updatedData = { ...req.body };
      if (req.file) {
        // Delete the old image file  
        const oldImagePath = path.join(__dirname, "../public/packaging", existingPackaging.image);  
        fs.unlink(oldImagePath, (err) => {  
          if (err) {  
            console.error("Failed to delete old image:", err);  
          }  
        });  
        updatedData.image = req.file.filename;  
      }
      const packaging = await PackagingService.update(req.params.id, updatedData);  
      if (!packaging) {  
        return res.status(404).json({  
          success: false,  
          data: null,  
          message: "not found",  
        });  
      }  
      res.status(200).json({  
        success: true,  
        data: packaging,  
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
      const deleted = await PackagingService.delete(req.params.id);  
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
  
module.exports = {PackagingController, upload};  
