const NotificationService = require("../services/notificationService");  
  
class NotificationController {   
  static async notifStok(req, res) {  
    try {  
      const { toko_id, cabang } = req.query;
      const notifications = await NotificationService.notifStok(toko_id, cabang);  
      res.status(200).json({  
        success: true,  
        data: notifications,  
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

  static async notifStokGudang(req, res) {  
    try {  
      const notifications = await NotificationService.notifStokGudang();  
      res.status(200).json({  
        success: true,  
        data: notifications,  
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
  
module.exports = NotificationController;  
