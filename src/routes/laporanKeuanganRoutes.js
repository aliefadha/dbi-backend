const express = require('express');  
const router = express.Router();  
const LaporanKeuanganController = require('../controllers/laporanKeuanganController');  

router.post('/laporan-keuangan', LaporanKeuanganController.create);  
router.get('/laporan-keuangan', LaporanKeuanganController.getAll);  
router.get('/laporan-keuangan/:id', LaporanKeuanganController.getById);  
router.put('/laporan-keuangan/:id', LaporanKeuanganController.update);  
router.delete('/laporan-keuangan/:id', LaporanKeuanganController.delete);  
  
module.exports = router;  
