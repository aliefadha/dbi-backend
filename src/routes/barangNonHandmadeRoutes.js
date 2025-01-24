const express = require('express');  
const router = express.Router();  
const BarangNonHandmadeController = require('../controllers/barangNonHandmadeController');  

router.post('/barang-non-handmade', BarangNonHandmadeController.create);  
router.get('/barang-non-handmade', BarangNonHandmadeController.getAll);  
router.get('/barang-non-handmade/:id', BarangNonHandmadeController.getById);  
router.put('/barang-non-handmade/:id', BarangNonHandmadeController.update);  
router.delete('/barang-non-handmade/:id', BarangNonHandmadeController.delete);  
  
module.exports = router;  
