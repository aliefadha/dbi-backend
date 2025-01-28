const express = require('express');  
const router = express.Router();  
const StokBarangController = require('../controllers/stokBarangController');  

router.post('/stok-barang', StokBarangController.create);  
router.get('/stok-barang', StokBarangController.getAll);  
router.get('/stok-barang/:id', StokBarangController.getById);  
router.put('/stok-barang/:id', StokBarangController.update);  
router.delete('/stok-barang/:id', StokBarangController.delete);  
  
module.exports = router;  
