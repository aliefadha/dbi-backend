const express = require('express');  
const router = express.Router();  
const BarangController = require('../controllers/barangController');  

router.post('/barang', BarangController.create);
router.get('/barang', BarangController.getAll); 
router.get('/barang/jenis/:id', BarangController.getAllByJenis); 
router.get('/barang/kategori/:id', BarangController.getAllByKategori); 
router.get('/barang/:id', BarangController.getById); 
router.put('/barang/:id', BarangController.update);  
router.delete('/barang/:id', BarangController.delete); 
 
  
module.exports = router;  
