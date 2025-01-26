const express = require('express');  
const router = express.Router();  
const BarangHandmadeGudangController = require('../controllers/barangHandmadeGudangController');  

router.post('/barang-handmade-gudang', BarangHandmadeGudangController.create);  
router.get('/barang-handmade-gudang', BarangHandmadeGudangController.getAll);  
router.get('/barang-handmade-gudang/:id', BarangHandmadeGudangController.getById);  
router.put('/barang-handmade-gudang/:id', BarangHandmadeGudangController.update);  
router.delete('/barang-handmade-gudang/:id', BarangHandmadeGudangController.delete);  
  
module.exports = router;  
