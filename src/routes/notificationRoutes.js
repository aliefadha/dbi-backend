const express = require('express');  
const router = express.Router();  
const NotificationController = require('../controllers/notificationController');  

router.get('/notification-stok', NotificationController.notifStok);  
router.get('/notification-stok-gudang', NotificationController.notifStokGudang);  
  
module.exports = router;  
