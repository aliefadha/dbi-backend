const express = require('express');  
const router = express.Router();  
const BiayaOperasionalProduksiGudangController = require('../controllers/biayaOperasionalProduksiGudangController');  

router.get('/biaya-operasional-produksi-gudang', BiayaOperasionalProduksiGudangController.getAll);  

  
module.exports = router;  
