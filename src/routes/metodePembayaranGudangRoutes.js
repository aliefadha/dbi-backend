const express = require('express');  
const router = express.Router();  
const MetodePembayaranGudangController = require('../controllers/metodePembayaranGudangController');  

router.post('/metode-pembayaran-gudang', MetodePembayaranGudangController.create);  
router.get('/metode-pembayaran-gudang', MetodePembayaranGudangController.getAll);  
router.get('/metode-pembayaran-gudang/:id', MetodePembayaranGudangController.getById);  
router.put('/metode-pembayaran-gudang/:id', MetodePembayaranGudangController.update);  
router.delete('/metode-pembayaran-gudang/:id', MetodePembayaranGudangController.delete);  
  
module.exports = router;  
