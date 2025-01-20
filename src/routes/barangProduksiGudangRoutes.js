const express = require('express');  
const router = express.Router();  
const BarangProduksiGudangController = require('../controllers/barangProduksiGudangController');  

router.post('/barang-produksi-gudang', BarangProduksiGudangController.create);  
router.get('/barang-produksi-gudang', BarangProduksiGudangController.getAll);  
router.get('/barang-produksi-gudang/:id', BarangProduksiGudangController.getById);  
router.put('/barang-produksi-gudang/:id', BarangProduksiGudangController.update);  
router.delete('/barang-produksi-gudang/:id', BarangProduksiGudangController.delete);  
  
module.exports = router;  
