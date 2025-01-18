const express = require('express');  
const router = express.Router();  
const PackagingPerBarangController = require('../controllers/packagingPerBarangController');  

router.post('/packaging-per-barang', PackagingPerBarangController.create);  
router.get('/packaging-per-barang', PackagingPerBarangController.getAll);  
router.get('/packaging-per-barang/:id', PackagingPerBarangController.getById);  
router.put('/packaging-per-barang/:id', PackagingPerBarangController.update);  
router.delete('/packaging-per-barang/:id', PackagingPerBarangController.delete);  
  
module.exports = router;  
