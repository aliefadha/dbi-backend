const express = require('express');  
const router = express.Router();  
const ProdukPembelianController = require('../controllers/produkPembelianController');  

router.post('/produk-pembelian', ProdukPembelianController.create);  
router.get('/produk-pembelian', ProdukPembelianController.getAll);  
router.get('/produk-pembelian/:id', ProdukPembelianController.getById);  
router.put('/produk-pembelian/:id', ProdukPembelianController.update);  
router.delete('/produk-pembelian/:id', ProdukPembelianController.delete);  
  
module.exports = router;  
