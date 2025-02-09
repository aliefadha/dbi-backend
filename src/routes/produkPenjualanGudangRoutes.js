const express = require('express');  
const router = express.Router();  
const ProdukPenjualanGudangController = require('../controllers/produkPenjualanGudangController');  

router.post('/produk-penjualan-gudang', ProdukPenjualanGudangController.create);  
router.get('/produk-penjualan-gudang', ProdukPenjualanGudangController.getAll);  
router.get('/produk-penjualan-gudang/terlaris', ProdukPenjualanGudangController.getAllTerlaris);
router.get('/produk-penjualan-gudang/topten', ProdukPenjualanGudangController.getTopten)
router.get('/produk-penjualan-gudang/:id', ProdukPenjualanGudangController.getById);  
router.put('/produk-penjualan-gudang/:id', ProdukPenjualanGudangController.update);  
router.delete('/produk-penjualan-gudang/:id', ProdukPenjualanGudangController.delete);  
  
module.exports = router;
