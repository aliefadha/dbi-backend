const BarangMentahService = require("../services/barangMentahService");  
const CustomIdGenerateService = require("../services/customIdGenerateService");
const multer = require("multer");
const path = require("path");
const fs = require('fs');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
      cb(null, path.join(__dirname, "../public/barangMentah"));
  },
  filename: function (req, file, cb) {
      cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage: storage });
  
class BarangMentahController {  
  static async create(req, res) {  
    try {  
      const newId = await CustomIdGenerateService.generateBarangMentahId();
      const data = {
        ...req.body,
        barang_mentah_id: newId,
        image: req.file ? req.file.filename : null,
      };
      const barangMentah = await BarangMentahService.create(data);  
      res.status(201).json({  
        success: true,  
        data: barangMentah,  
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
      const { page, limit } = req.query;
      const currentPage = parseInt(page) || 1;
      const itemsPerPage = parseInt(limit) || 10;
      const result = await BarangMentahService.getAll(
        currentPage,
        itemsPerPage
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
      const barangMentah = await BarangMentahService.getById(req.params.id);  
      if (!barangMentah) {  
        return res.status(404).json({  
          success: false,  
          data: null,  
          message: "not found",  
        });  
      }  
      res.status(200).json({  
        success: true,  
        data: barangMentah,  
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
      const existingBarangMentah = await BarangMentahService.getById(req.params.id);  
      if (!existingBarangMentah) {  
        return res.status(404).json({  
          success: false,  
          data: null,  
          message: "not found",  
        });  
      }  

      const updatedData = { ...req.body };  

      // Handle image update only if new file is uploaded
      if (req.file) {  
        if (existingBarangMentah.image) {
          const oldImagePath = path.join(__dirname, "../public/barangMentah", existingBarangMentah.image);  
          fs.unlink(oldImagePath, (err) => {  
            if (err) {  
              console.error("Failed to delete old image:", err);  
            }  
          });  
        }
        updatedData.image = req.file.filename;  
      }

      const barangMentah = await BarangMentahService.update(req.params.id, updatedData);  
      if (!barangMentah) {  
        return res.status(404).json({  
          success: false,  
          data: null,  
          message: "not found",  
        });  
      }  

      res.status(200).json({  
        success: true,  
        data: barangMentah,  
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
      const deleted = await BarangMentahService.delete(req.params.id);  
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
  
module.exports = {BarangMentahController, upload};
