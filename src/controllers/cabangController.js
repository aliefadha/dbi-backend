const CabangService = require("../services/cabangService");
const bcrypt = require("bcrypt");
const { compare } = require("bcrypt");
class CabangController {
  static async create(req, res) {
    try {
      const pasword = req.body.password;
      const newPassword = req.body.password.substring(0, 3) + '*'.repeat(req.body.password.length - 3);
      if (pasword !== req.body.confirmPassword) {
        return res.status(400).json({
          success: false,
          data: null,
          message: "password and confirm password not match",
        });
      }
      const hashPassword = bcrypt.hashSync(req.body.password, 10);
      const cabangData = {
        ...req.body,
        password: hashPassword,
        detail_password: newPassword
      }
      const cabang = await CabangService.create(cabangData);
      res.status(201).json({
        success: true,
        data: cabang,
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
      const { toko_id } = req.query;
      const cabangs = await CabangService.getAll(toko_id);
      res.status(200).json({
        success: true,
        data: cabangs,
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
      const cabang = await CabangService.getById(req.params.id);
      if (!cabang) {
        return res.status(404).json({
          success: false,
          data: null,
          message: "not found",
        });
      }
      res.status(200).json({
        success: true,
        data: cabang,
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
      const pasword = req.body.password;
      const newPassword = req.body.password.substring(0, 3) + '*'.repeat(req.body.password.length - 3);
      if (pasword !== req.body.confirmPassword) {
        return res.status(400).json({
          success: false,
          data: null,
          message: "password and confirm password not match",
        });
      }
      const hashPassword = bcrypt.hashSync(req.body.password, 10);
      const cabangData = {
        ...req.body,
        password: hashPassword,
        detail_password: newPassword
      }
      const cabang = await CabangService.update(req.params.id, cabangData);
      if (!cabang) {
        return res.status(404).json({
          success: false,
          data: null,
          message: "not found",
        });
      }
      res.status(200).json({
        success: true,
        data: cabang,
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
      const deleted = await CabangService.delete(req.params.id);
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
      let user = await CabangService.getById(req.params.id);
      if (!user) {
        return res.status(404).json({
          success: false,
          data: null,
          message: "Karyawan not found"
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

      const cabangData = {
        ...req.body,
        detail_password: detailPassword
      }
      const cabang = await CabangService.update(req.params.id, cabangData);
      if (!cabang) {
        return res.status(404).json({
          success: false,
          data: null,
          message: "not found",
        });
      }
      res.status(200).json({
        success: true,
        data: cabang,
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
}

module.exports = CabangController;  
