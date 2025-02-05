const express = require('express');  
const router = express.Router();  
const ProdukPenjualanController = require('../controllers/produkPenjualanController');  

router.post('/produk-penjualan', ProdukPenjualanController.create);  
router.get('/produk-penjualan', ProdukPenjualanController.getAll);  
router.get('/produk-penjualan/:id', ProdukPenjualanController.getById);  
router.put('/produk-penjualan/:id', ProdukPenjualanController.update);  
router.delete('/produk-penjualan/:id', ProdukPenjualanController.delete);  
  
module.exports = router;  
