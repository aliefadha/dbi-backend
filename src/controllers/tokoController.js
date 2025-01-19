const TokoService = require("../services/tokoService");  
const bcrypt = require("bcrypt");
const multer = require("multer");
const path = require("path");
const fs = require('fs');

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
      const tokoData = {
        ...req.body,
        password: hashPassword,
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
      const updatedData = { ...req.body };
      
      if (req.file) {  
        // Delete the old image file  
        const oldImagePath = path.join(__dirname, "../public/toko", existingToko.image);  
        fs.unlink(oldImagePath, (err) => {  
          if (err) {  
            console.error("Failed to delete old image:", err);  
          }  
        });  
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
}  
  
module.exports = {TokoController, upload};  
