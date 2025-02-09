const express = require('express');  
const router = express.Router();  
const KategoriPemasukanController = require('../controllers/kategoriPemasukanController');  

router.post('/kategori-pemasukan', KategoriPemasukanController.create);  
router.get('/kategori-pemasukan', KategoriPemasukanController.getAll);  
router.get('/kategori-pemasukan/:id', KategoriPemasukanController.getById);  
router.put('/kategori-pemasukan/:id', KategoriPemasukanController.update);  
router.delete('/kategori-pemasukan/:id', KategoriPemasukanController.delete);  
  
module.exports = router;  
