const express = require('express');  
const router = express.Router();  
const JenisBarangController = require('../controllers/jenisBarangController');  

router.post('/jenis-barang', JenisBarangController.create);  
router.get('/jenis-barang', JenisBarangController.getAll);  
router.get('/jenis-barang/:id', JenisBarangController.getById);  
router.put('/jenis-barang/:id', JenisBarangController.update);
router.delete('/jenis-barang/:id', JenisBarangController.delete);  
  
module.exports = router;  
