const express = require('express');  
const router = express.Router();  
const JenisBarangGudangController = require('../controllers/jenisBarangGudangController');  

router.post('/jenis-barang-gudang', JenisBarangGudangController.create);  
router.get('/jenis-barang-gudang', JenisBarangGudangController.getAll);  
router.get('/jenis-barang-gudang/:id', JenisBarangGudangController.getById);  
router.put('/jenis-barang-gudang/:id', JenisBarangGudangController.update);  
router.delete('/jenis-barang-gudang/:id', JenisBarangGudangController.delete);  
  
module.exports = router;  
