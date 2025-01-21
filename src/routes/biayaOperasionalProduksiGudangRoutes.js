const express = require('express');  
const router = express.Router();  
const BiayaOperasionalProduksiGudangController = require('../controllers/biayaOperasionalProduksiGudangController');  

router.post('/biaya-operasional-produksi-gudang', BiayaOperasionalProduksiGudangController.create);  
router.get('/biaya-operasional-produksi-gudang', BiayaOperasionalProduksiGudangController.getAll);  
router.get('/biaya-operasional-produksi-gudang/:id', BiayaOperasionalProduksiGudangController.getById);  
router.put('/biaya-operasional-produksi-gudang/:id', BiayaOperasionalProduksiGudangController.update);  
router.delete('/biaya-operasional-produksi-gudang/:id', BiayaOperasionalProduksiGudangController.delete);  
  
module.exports = router;  
