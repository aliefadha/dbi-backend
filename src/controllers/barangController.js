const BarangService = require("../services/barangService");

class BarangController {
  static async create(req, res) {
    try {
      const barang = await BarangService.create(req.body);
      res.status(201).json({
        success: true,
        data: barang,
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
      const barangs = await BarangService.getAll();
      res.status(200).json({
        success: true,
        data: barangs,
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
  
  static async getAllByJenis(req, res) {
    try {
      const barangs = await BarangService.getAllByJenis(req.params.id);
      res.status(200).json({
        success: true,
        data: barangs,
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

  static async getAllByKategori(req, res) {
    try {
      const barangs = await BarangService.getAllByKategori(req.params.id);
      res.status(200).json({
        success: true,
        data: barangs,
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
      const barang = await BarangService.getById(req.params.id);
      if (!barang) {
        return res.status(404).json({
          success: false,
          data: null,
          message: "not found",
        });
      }
      res.status(200).json({
        success: true,
        data: barang,
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
      const barang = await BarangService.update(req.params.id, req.body);
      if (!barang) {
        return res.status(404).json({
          success: false,
          data: null,
          message: "not found",
        });
      }
      res.status(200).json({
        success: true,
        data: barang,
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
      const deleted = await BarangService.delete(req.params.id);
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

module.exports = BarangController;  
