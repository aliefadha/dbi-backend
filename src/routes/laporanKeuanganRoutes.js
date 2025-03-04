const express = require('express');  
const router = express.Router();  
const LaporanKeuanganController = require('../controllers/laporanKeuanganController');  

router.get('/laporan-keuangan', LaporanKeuanganController.getAll);  
router.get('/laporan-keuangan/export', LaporanKeuanganController.export);
router.get('/laporan-keuangan/kategori', LaporanKeuanganController.getKategori);
router.get('/laporan-keuangan/pemasukan', LaporanKeuanganController.getPemasukan);
router.get('/laporan-keuangan/pengeluaran', LaporanKeuanganController.getPengeluaran)

module.exports = router;  
