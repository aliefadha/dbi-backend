const express = require('express');  
const router = express.Router();  
const BarangNonHandmadeGudangController = require('../controllers/barangNonHandmadeGudangController');  

router.post('/barang-nonhandmade-gudang', BarangNonHandmadeGudangController.create);  
router.get('/barang-nonhandmade-gudang', BarangNonHandmadeGudangController.getAll);  
router.get('/barang-nonhandmade-gudang/:id', BarangNonHandmadeGudangController.getById);  
router.put('/barang-nonhandmade-gudang/:id', BarangNonHandmadeGudangController.update);  
router.delete('/barang-nonhandmade-gudang/:id', BarangNonHandmadeGudangController.delete);  
  
module.exports = router;  
