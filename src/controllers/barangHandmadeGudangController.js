const fs = require('fs');
const path = require('path');
const BarangHandmadeGudangService = require("../services/barangHandmadeGudangService");
const multer = require("multer");
const CustomIdGenerateService = require('../services/customIdGenerateService');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "../public/barangHandmadeGudang"));
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage: storage });

class BarangHandmadeGudangController {
  static async create(req, res) {
    try {
      const newId = await CustomIdGenerateService.generateBarangHandmadeGudangId();
      const barangHandmadeData = {
        ...req.body,
        image: req.file ? req.file.filename : null,
        barang_handmade_id: newId,
      }

      const result = await BarangHandmadeGudangService.create(barangHandmadeData);

      res.status(201).json({
        success: true,
        data: result,
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
      const result = await BarangHandmadeGudangService.getAll(
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
      const barangHandmadeGudang = await BarangHandmadeGudangService.getById(req.params.id);
      if (!barangHandmadeGudang) {
        return res.status(404).json({
          success: false,
          data: null,
          message: "not found",
        });
      }
      res.status(200).json({
        success: true,
        data: barangHandmadeGudang,
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
      const existingBarangHandmadeGudang = await BarangHandmadeGudangService.getById(req.params.id);
      if (!existingBarangHandmadeGudang) {
        return res.status(404).json({
          success: false,
          data: null,
          message: "not found",
        });
      }

      const updatedData = { ...req.body };

      // Check if a new file is uploaded
      if (req.file) {
        // Delete the old image file
        const oldImagePath = path.join(__dirname, "../public/barangHandmadeGudang", existingBarangHandmadeGudang.image);
        fs.unlink(oldImagePath, (err) => {
          if (err) {
            console.error("Failed to delete old image:", err);
          }
        });

        updatedData.image = req.file.filename;
      }

      const barangHandmadeGudang = await BarangHandmadeGudangService.update(req.params.id, updatedData);
      if (!barangHandmadeGudang) {
        return res.status(404).json({
          success: false,
          data: null,
          message: "not found",
        });
      }

      res.status(200).json({
        success: true,
        data: barangHandmadeGudang,
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
      const deleted = await BarangHandmadeGudangService.delete(req.params.id);
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

module.exports = { BarangHandmadeGudangController, upload };
