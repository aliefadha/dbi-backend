const express = require('express');  
const router = express.Router();  
const PenjualanController = require('../controllers/penjualanController');  

router.post('/penjualan', PenjualanController.create);  
router.get('/penjualan', PenjualanController.getAll);  
router.get('/penjualan/:id', PenjualanController.getById);  
router.put('/penjualan/:id', PenjualanController.update);  
router.delete('/penjualan/:id', PenjualanController.delete);  
  
module.exports = router;  
