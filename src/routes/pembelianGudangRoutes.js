const express = require('express');  
const router = express.Router();  
const PembelianGudangController = require('../controllers/pembelianGudangController');  

router.post('/pembelian-gudang', PembelianGudangController.create);  
router.get('/pembelian-gudang', PembelianGudangController.getAll);  
router.get('/pembelian-gudang/:id', PembelianGudangController.getById);  
router.put('/pembelian-gudang/:id', PembelianGudangController.update);  
router.delete('/pembelian-gudang/:id', PembelianGudangController.delete);  
  
module.exports = router;  
