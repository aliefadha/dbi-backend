const TokoService = require("../services/tokoService");

class TokoController {
  static async create(req, res) {
    try {
      const toko = await TokoService.create(req.body);
      res.status(201).json({
        success: true,
        data: toko,
        message: "Toko created successfully",
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
      const toko = await TokoService.getAll();
      res.status(200).json({
        success: true,
        data: toko,
        message: "Tokos retrieved successfully",
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
      const toko = await TokoService.getById(req.params.id);
      if (!toko) {
        return res.status(404).json({
          success: false,
          data: null,
          message: "Toko not found",
        });
      }
      res.status(200).json({
        success: true,
        data: toko,
        message: "Toko retrieved successfully",
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
      const toko = await TokoService.update(req.params.id, req.body);
      if (!toko) {
        return res.status(404).json({
          success: false,
          data: null,
          message: "Toko not found",
        });
      }
      res.status(200).json({
        success: true,
        data: toko,
        message: "Toko updated successfully",
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
      const deleted = await TokoService.delete(req.params.id);
      if (!deleted) {
        return res.status(404).json({
          success: false,
          data: null,
          message: "Toko not found",
        });
      }
      res.status(200).json({
        success: true,
        data: null,
        message: "Toko deleted successfully",
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

module.exports = TokoController;
