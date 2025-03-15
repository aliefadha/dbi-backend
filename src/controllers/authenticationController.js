const AuthenticationService = require("../services/authenticationService");  
const bcrypt = require("bcrypt");  
const multer = require("multer");
const path = require("path");
const fs = require('fs');
const { compare } = require("bcrypt");
const blacklist = require("../config/blacklist");
const CabangService = require("../services/cabangService");
const TokoService = require("../services/tokoService");

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
      // Check if the user wants to change the password
      const oldPassword = req.body.old_password;
      const newPassword = req.body.password;
      const confirmPassword = req.body.confirm_password;

      if (oldPassword || newPassword || confirmPassword) {
          // If any of the password fields are provided, validate them
          let valid = await compare(oldPassword, user.password);
          if (!valid) {
              return res.status(400).json({
                  success: false,
                  data: null,
                  message: "old password not match",
              });
          }

          if (newPassword !== confirmPassword) {
              return res.status(400).json({
                  success: false,
                  data: null,
                  message: "password and confirm password do not match",
              });
          }

          const hashPassword = bcrypt.hashSync(newPassword, 10);
          req.body.password = hashPassword;
      } else {
          // If no password fields are provided, remove the password field from the request body
          delete req.body.password;
      }
      const authData = {
        ...req.body,
      }
      if (req.file) {
        if(user.image!==null) {
          const oldImage = path.join(__dirname, "../public/authentication/" + user.image);
          fs.unlink(oldImage, (err) => {
            if (err) {
              console.log("Failed to delete old image:", err);
            }
          }); 
        }
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

  static async getAll(req, res) {
    try {
      const authentication = await AuthenticationService.getAll();
      const listToko = await TokoService.getAll();
      const cabang = await CabangService.getById(1);

      const authenticationData = authentication.map(auth => auth.dataValues);
      const cabangData = cabang.dataValues;
  
      // Rename properties
      const renamedAuthentication = authenticationData.map(auth => ({
        user_id: auth.authentication_id,
        nama: auth.nama,
        email: auth.email,
        role_id: 1,
        role_name: auth.role
      }))
      const renamedToko = listToko.map(toko => ({
        user_id: toko.toko_id,
        nama: toko.nama_toko, 
        email: toko.email,
        role_id: 2,
        role_name: toko.role
      }));

      const renamedCabang = {
        user_id: cabangData.cabang_id,
        nama: cabangData.nama_cabang, 
        email: cabangData.email,
        role_id: 3,
        role_name: "Admin Gudang"
      };

      // Combine the results
      const combinedResults = [
        ...renamedAuthentication,
        ...renamedToko,
        renamedCabang,
      ];

      res.status(200).json({
        success: true,
        data: combinedResults,
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
