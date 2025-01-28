const express = require('express');  
const router = express.Router();  
const {BarangHandmadeGudangController, upload} = require('../controllers/barangHandmadeGudangController');  

router.post('/barang-handmade-gudang', upload.single("image"), BarangHandmadeGudangController.create);  
router.get('/barang-handmade-gudang', BarangHandmadeGudangController.getAll);  
router.get('/barang-handmade-gudang/:id', BarangHandmadeGudangController.getById);  
router.put('/barang-handmade-gudang/:id', upload.single("image"), BarangHandmadeGudangController.update);  
router.delete('/barang-handmade-gudang/:id', BarangHandmadeGudangController.delete);  
  
module.exports = router;  
