const express = require('express');  
const router = express.Router();  
const PembelianController = require('../controllers/pembelianController');  

router.post('/pembelian', PembelianController.create);  
router.get('/pembelian', PembelianController.getAll);  
router.get('/pembelian/:id', PembelianController.getById);  
router.put('/pembelian/:id', PembelianController.update);  
router.delete('/pembelian/:id', PembelianController.delete);  
  
module.exports = router;  
