const express = require('express');  
const router = express.Router();  
const JenisBarangController = require('../controllers/jenisBarangController');  

router.post('/kategori-barang', JenisBarangController.create);  
router.get('/kategori-barang', JenisBarangController.getAll);  
router.get('/kategori-barang/:id', JenisBarangController.getById);  
router.put('/kategori-barang/:id', JenisBarangController.update);
router.put('/kategori-barang/:id/barang', JenisBarangController.update)  
router.delete('/kategori-barang/:id', JenisBarangController.delete);  
  
module.exports = router;  
