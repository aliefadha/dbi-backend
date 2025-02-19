const express = require('express');  
const router = express.Router();  
const PengeluaranController = require('../controllers/pengeluaranController');  

router.post('/pengeluaran', PengeluaranController.create);  
router.get('/pengeluaran', PengeluaranController.getAll);  
router.get('/pengeluaran/kategori/:kategori_id', PengeluaranController.getByKategori);
router.get('/pengeluaran/toko/:toko_id', PengeluaranController.getByToko);
router.get('/pengeluaran/:id', PengeluaranController.getById);  
router.put('/pengeluaran/:id', PengeluaranController.update);  
router.delete('/pengeluaran/:id', PengeluaranController.delete);  
  
module.exports = router;
