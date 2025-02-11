const AuthenticationService = require("../services/authenticationService");  
  
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
}  
  
module.exports = AuthenticationController;  
