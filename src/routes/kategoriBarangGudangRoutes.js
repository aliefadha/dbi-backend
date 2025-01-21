const express = require('express');  
const router = express.Router();  
const KategoriBarangGudangController = require('../controllers/kategoriBarangGudangController');  

router.post('/kategori-barang-gudang', KategoriBarangGudangController.create);  
router.get('/kategori-barang-gudang', KategoriBarangGudangController.getAll);  
router.get('/kategori-barang-gudang/:id', KategoriBarangGudangController.getById);  
router.put('/kategori-barang-gudang/:id', KategoriBarangGudangController.update);  
router.delete('/kategori-barang-gudang/:id', KategoriBarangGudangController.delete);  
  
module.exports = router;  
