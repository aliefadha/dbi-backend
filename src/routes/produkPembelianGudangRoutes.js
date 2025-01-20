const express = require('express');  
const router = express.Router();  
const ProdukPembelianGudangController = require('../controllers/produkPembelianGudangController');  

router.post('/produk-pembelian-gudang', ProdukPembelianGudangController.create);  
router.get('/produk-pembelian-gudang', ProdukPembelianGudangController.getAll);  
router.get('/produk-pembelian-gudang/:id', ProdukPembelianGudangController.getById);  
router.put('/produk-pembelian-gudang/:id', ProdukPembelianGudangController.update);  
router.delete('/produk-pembelian-gudang/:id', ProdukPembelianGudangController.delete);  
  
module.exports = router;  
