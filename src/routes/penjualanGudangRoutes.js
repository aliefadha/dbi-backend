const express = require('express');  
const router = express.Router();  
const PenjualanGudangController = require('../controllers/penjualanGudangController');  

router.post('/penjualan-gudang', PenjualanGudangController.create);  
router.get('/penjualan-gudang', PenjualanGudangController.getAll);  
router.get('/penjualan-gudang/:id', PenjualanGudangController.getById);  
router.put('/penjualan-gudang/:id', PenjualanGudangController.update);  
router.delete('/penjualan-gudang/:id', PenjualanGudangController.delete);  
  
module.exports = router;  
