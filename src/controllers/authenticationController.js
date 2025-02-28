const AuthenticationService = require("../services/authenticationService");  
const bcrypt = require("bcrypt");  
const multer = require("multer");
const path = require("path");
const fs = require('fs');
const { compare } = require("bcrypt");
const blacklist = require("../config/blacklist");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "../public/authentication"));
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});
const upload = multer({ storage: storage });
class AuthenticationController {  
  static async login(req, res) {  
    try {
      const { email, password, role } = req.body;
      const authentication = await AuthenticationService.login(email, password, role);
      res.status(200).json({
        success: true,
        data: authentication,
        message: "login successfully",
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        data: null,
        message: error.message,
      });
    }
  }

  static async logout(req, res) {
    try {
      const token = req.headers['authorization'].split(' ')[1];
      blacklist.addToken(token);
      res.status(200).json({
        success: true,
        data: null,
        message: "logout successfully",
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        data: null,
        message: error.message,
      });
    }
  }

  static async update(req, res) {
    try {
      let user = await AuthenticationService.getById(req.params.id);
      if (!user) {
        return res.status(404).json({
          success: false,
          data: null,
          message: "not found",
        });
      }
      const oldPassword = req.body.old_password;
      let valid = await compare(oldPassword, user.password); 
      if (!valid) {
        return res.status(400).json({
          success: false,
          data: null,
          message: "old password not match",
        });
      }
      const pasword = req.body.password;  
      if (pasword !== req.body.confirm_password) {  
        return res.status(400).json({  
          success: false,  
          data: null,  
          message: "password and confirm password not match",  
        });  
      }
      const hashPassword = bcrypt.hashSync(req.body.password, 10);
      const authData = {
        ...req.body,
        password: hashPassword
      }
      if (req.file) {
        const oldImage = path.join(__dirname, "../public/authentication/" + user.image);
        fs.unlink(oldImage, (err) => {
          if (err) {
            console.log("Failed to delete old image:", err);
          }
        });
        authData.image = req.file.filename;
      }
      const authentication = await AuthenticationService.update(req.params.id, authData);
      if (!authentication) {
        return res.status(404).json({
          success: false,
          data: null,
          message: "not found",
        });
      }
      res.status(200).json({
        success: true,
        data: authentication,
        message: "update successfully",
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        data: null,
        message: error.message,
      });
    }
  }

  static async getById(req, res) {  
    try {  
      const authentication = await AuthenticationService.getById(req.params.id);  
      if (!authentication) {  
        return res.status(404).json({  
          success: false,  
          data: null,  
          message: "not found",  
        });  
      }  
      res.status(200).json({  
        success: true,  
        data: authentication,  
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
}  
  
module.exports = {AuthenticationController, upload};  
