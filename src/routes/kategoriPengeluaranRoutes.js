const express = require('express');  
const router = express.Router();  
const KategoriPengeluaranController = require('../controllers/kategoriPengeluaranController');  

router.post('/kategori-pengeluaran', KategoriPengeluaranController.create);  
router.get('/kategori-pengeluaran', KategoriPengeluaranController.getAll);  
router.get('/kategori-pengeluaran/:id', KategoriPengeluaranController.getById);  
router.put('/kategori-pengeluaran/:id', KategoriPengeluaranController.update);  
router.delete('/kategori-pengeluaran/:id', KategoriPengeluaranController.delete);  
  
module.exports = router;  
