const express = require('express');  
const router = express.Router();  
const RincianBiayaGudangController = require('../controllers/rincianBiayaGudangController');  

router.post('/rincian-biaya-gudang', RincianBiayaGudangController.create);  
router.get('/rincian-biaya-gudang', RincianBiayaGudangController.getAll);  
router.get('/rincian-biaya-gudang/:id', RincianBiayaGudangController.getById);  
router.put('/rincian-biaya-gudang/:id', RincianBiayaGudangController.update);  
router.delete('/rincian-biaya-gudang/:id', RincianBiayaGudangController.delete);  
  
module.exports = router;  
