const AuthenticationService = require("../services/authenticationService");  
const bcrypt = require("bcrypt");  
  
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

  static async update(req, res) {
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
      const authData = {
        ...req.body,
        password: hashPassword
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
}  
  
module.exports = AuthenticationController;  
