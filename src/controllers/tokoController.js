const TokoService = require("../services/tokoService");
const bcrypt = require("bcrypt");
const multer = require("multer");
const path = require("path");
const fs = require('fs');
const { compare } = require("bcrypt");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../public/toko'));
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

class TokoController {
  static async create(req, res) {
    try {
      const password = req.body.password;
      if (password !== req.body.confirmPassword) {
        return res.status(400).json({
          success: false,
          data: null,
          message: "password and confirm password not match",
        });
      }
      const hashPassword = bcrypt.hashSync(req.body.password, 10);
      const detailPassword = req.body.password.substring(0, 3) + '*'.repeat(req.body.password.length - 3);
      const tokoData = {
        ...req.body,
        password: hashPassword,
        detail_password: detailPassword,
        image: req.file.filename
      }
      const toko = await TokoService.create(tokoData);
      res.status(201).json({
        success: true,
        data: toko,
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
      const tokos = await TokoService.getAll();
      res.status(200).json({
        success: true,
        data: tokos,
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
      const toko = await TokoService.getById(req.params.id);
      if (!toko) {
        return res.status(404).json({
          success: false,
          data: null,
          message: "not found",
        });
      }
      res.status(200).json({
        success: true,
        data: toko,
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
      const existingToko = await TokoService.getById(req.params.id);
      if (!existingToko) {
        return res.status(404).json({
          success: false,
          data: null,
          message: "not found",
        });
      }
      const pasword = req.body.password;
      const detailPassword = req.body.password.substring(0, 3) + '*'.repeat(req.body.password.length - 3);

      if (pasword !== req.body.confirmPassword) {
        return res.status(400).json({
          success: false,
          data: null,
          message: "password and confirm password not match",
        });
      }
      const hashPassword = bcrypt.hashSync(req.body.password, 10);
      const updatedData = { ...req.body, detail_password: detailPassword, password: hashPassword };

      if (req.file) {
        // Check if existingToko.image is not null
        if (existingToko.image) {
          // Delete the old image file
          const oldImagePath = path.join(__dirname, "../public/toko", existingToko.image);
          fs.unlink(oldImagePath, (err) => {
            if (err) {
              console.error("Failed to delete old image:", err);
            }
          });
        }
        updatedData.image = req.file.filename;
      }

      const toko = await TokoService.update(req.params.id, updatedData);
      if (!toko) {
        return res.status(404).json({
          success: false,
          data: null,
          message: "not found",
        });
      }
      res.status(200).json({
        success: true,
        data: toko,
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
      const deleted = await TokoService.delete(req.params.id);
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

  static async updateByUserId(req, res) {
    try {
      let user = await TokoService.getById(req.params.id);
      if (!user) {
        return res.status(404).json({
          success: false,
          data: null,
          message: "Toko not found"
        });
      }
      // Ambil input
      const oldPassword = req.body.old_password;
      const newPassword = req.body.password;
      const confirmPassword = req.body.confirm_password;

      let detailPassword = user.detail_password; // default: tetap password lama

      // Jika user ingin update password
      if (oldPassword || newPassword || confirmPassword) {
          // Semua field password harus diisi
          if (!oldPassword || !newPassword || !confirmPassword) {
              return res.status(400).json({
                  success: false,
                  data: null,
                  message: "All password fields (old, new, confirm) must be provided",
              });
          }

          // Validasi password lama
          const valid = await compare(oldPassword, user.password);
          if (!valid) {
              return res.status(400).json({
                  success: false,
                  data: null,
                  message: "Old password not match",
              });
          }

          // Validasi new password sama confirm
          if (newPassword !== confirmPassword) {
              return res.status(400).json({
                  success: false,
                  data: null,
                  message: "Password and confirm password do not match",
              });
          }

          // Jika semua validasi lolos → hash password baru
          const hashPassword = bcrypt.hashSync(newPassword, 10);
          req.body.password = hashPassword;
          detailPassword = newPassword.substring(0, 3) + '*'.repeat(newPassword.length - 3);
      } else {
          // Tidak ingin update password
          delete req.body.password;
      }
      const tokoData = {
        ...req.body,
        detail_password: detailPassword
      }
      if (req.file) {
        // Delete the old image file  
        if (user.image) {
          const oldImagePath = path.join(__dirname, "../public/toko", user.image);
          fs.unlink(oldImagePath, (err) => {
            if (err) {
              console.error("Failed to delete old image:", err);
            }
          });
        }
        tokoData.image = req.file.filename;
      }
      const toko = await TokoService.update(req.params.id, tokoData);
      if (!toko) {
        return res.status(404).json({
          success: false,
          data: null,
          message: "not found",
        });
      }
      res.status(200).json({
        success: true,
        data: toko,
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

  static async tokoTerlaris(req, res) {
    try {
      const { toko_id, startDate, endDate } = req.query;

      if (toko_id) {
        const existingToko = await TokoService.getById(toko_id);
        if (!existingToko) {
          return res.status(404).json({
            success: false,
            data: null,
            message: "Toko not found",
          });
        }
      }

      const tokoId = await TokoService.tokoTerlaris(toko_id, startDate, endDate);
      res.status(200).json({
        success: true,
        data: tokoId,
        message: "Toko terlaris retrieved successfully",
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

module.exports = { TokoController, upload };
