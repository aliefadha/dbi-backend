const express = require('express');  
const router = express.Router();  
const OperasionalProduksiGudangController = require('../controllers/operasionalProduksiGudangController');  

router.post('/operasional-produksi-gudang', OperasionalProduksiGudangController.create);  
router.get('/operasional-produksi-gudang', OperasionalProduksiGudangController.getAll);  
router.get('/operasional-produksi-gudang/:id', OperasionalProduksiGudangController.getById);  
router.put('/operasional-produksi-gudang/:id', OperasionalProduksiGudangController.update);  
router.delete('/operasional-produksi-gudang/:id', OperasionalProduksiGudangController.delete);  
  
module.exports = router;  
