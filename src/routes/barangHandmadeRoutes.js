const express = require('express');  
const router = express.Router();  
const BarangHandmadeController = require('../controllers/barangHandmadeController');  

router.post('/barang-handmade', BarangHandmadeController.create);  
router.get('/barang-handmade', BarangHandmadeController.getAll);  
router.get('/barang-handmade/:id', BarangHandmadeController.getById);  
router.put('/barang-handmade/:id', BarangHandmadeController.update);  
router.delete('/barang-handmade/:id', BarangHandmadeController.delete);  
  
module.exports = router;  
