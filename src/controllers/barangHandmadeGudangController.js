const fs = require('fs');
const path = require('path');
const BarangHandmadeGudangService = require("../services/barangHandmadeGudangService");
const RincianBahanGudangService = require("../services/rincianBahanGudangService");
const sequelize = require("../config/database");
const multer = require("multer");

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
      const { rincian_bahan, ...barangData } = req.body;
  
      if (!rincian_bahan || !Array.isArray(rincian_bahan) || rincian_bahan.length === 0) {
        return res.status(400).json({
          success: false,
          data: null,
          message: "rincian bahan kosong",
        });
      }
  
      const result = await BarangHandmadeGudangService.createWithDetails(barangData, rincian_bahan);
  
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
      const barangHandmadeGudangs = await BarangHandmadeGudangService.getAll();
      res.status(200).json({
        success: true,
        data: barangHandmadeGudangs,
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
    let transaction;

    try {
      const { rincian_bahan, ...barangData } = req.body;

      const existingBarangHandmadeGudang = await BarangHandmadeGudangService.getById(req.params.id);
      if (!existingBarangHandmadeGudang) {
        return res.status(404).json({
          success: false,
          data: null,
          message: "not found",
        });
      }

      transaction = await sequelize.transaction();

      // Handle image update
      if (req.file) {
        const oldImagePath = path.join(__dirname, "../public/barangHandmadeGudang", existingBarangHandmadeGudang.image);
        fs.unlink(oldImagePath, (err) => {
          if (err) {
            console.error("Failed to delete old image:", err);
          }
        });
        barangData.image = req.file.filename;
      }

      const barangHandmadeGudang = await BarangHandmadeGudangService.update(req.params.id, barangData, { transaction });

      // Update rincian bahan if provided
      if (rincian_bahan && Array.isArray(rincian_bahan)) {
        await RincianBahanGudangService.deleteByBarangId(barangHandmadeGudang.barang_handmade_id, { transaction });

        const rincianBahanToCreate = rincian_bahan.map((bahan) => ({
          ...bahan,
          barang_handmade_id: req.params.id,
        }));

        await RincianBahanGudangService.createMany(rincianBahanToCreate, { transaction });
      }

      await transaction.commit();

      const updatedBarangHandmadeGudang = await BarangHandmadeGudangService.getById(req.params.id);

      res.status(200).json({
        success: true,
        data: updatedBarangHandmadeGudang,
        message: "updated successfully",
      });
    } catch (error) {
      if (transaction && !transaction.finished) {
        await transaction.rollback();
      }

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

module.exports = BarangHandmadeGudangController;
