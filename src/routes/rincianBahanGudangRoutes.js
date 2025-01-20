const express = require('express');  
const router = express.Router();  
const RincianBahanGudangController = require('../controllers/rincianBahanGudangController');  

router.post('/rincian-bahan-gudang', RincianBahanGudangController.create);  
router.get('/rincian-bahan-gudang', RincianBahanGudangController.getAll);  
router.get('/rincian-bahan-gudang/:id', RincianBahanGudangController.getById);  
router.put('/rincian-bahan-gudang/:id', RincianBahanGudangController.update);  
router.delete('/rincian-bahan-gudang/:id', RincianBahanGudangController.delete);  
  
module.exports = router;  
