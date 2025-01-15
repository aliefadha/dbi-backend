const CabangService = require("../services/cabangService");  
const bcrypt = require("bcrypt");  
class CabangController {  
  static async create(req, res) {  
    try {  
      const pasword = req.body.password;  
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
        password: hashPassword
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
      const cabangs = await CabangService.getAll();  
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
      const cabang = await CabangService.update(req.params.id, req.body);  
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
}  
  
module.exports = CabangController;  
