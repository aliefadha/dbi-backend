const express = require('express');  
const router = express.Router();  
const {BarangHandmadeController, upload} = require('../controllers/barangHandmadeController');  

router.post('/barang-handmade', upload.single("image"), BarangHandmadeController.create);  
router.get('/barang-handmade', BarangHandmadeController.getAll);  
router.get('/barang-handmade/:id', BarangHandmadeController.getById);  
router.put('/barang-handmade/:id', upload.single("image"), BarangHandmadeController.update);  
router.delete('/barang-handmade/:id', BarangHandmadeController.delete);  
  
module.exports = router;  
