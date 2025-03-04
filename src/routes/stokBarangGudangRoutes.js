const express = require('express');  
const router = express.Router();  
const StokBarangGudangController = require('../controllers/stokBarangGudangController');  

router.post('/stok-barang-gudang', StokBarangGudangController.create);  
router.get('/stok-barang-gudang', StokBarangGudangController.getAll);  
router.get('/stok-barang-gudang/export', StokBarangGudangController.export);
router.get('/stok-barang-gudang/:id', StokBarangGudangController.getById);  
router.put('/stok-barang-gudang/:id', StokBarangGudangController.update);  
router.delete('/stok-barang-gudang/:id', StokBarangGudangController.delete);  
  
module.exports = router;  
