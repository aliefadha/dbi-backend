const express = require('express');  
const router = express.Router();  
const {BarangNonHandmadeController, upload} = require('../controllers/barangNonHandmadeController');  

router.post('/barang-non-handmade', upload.single("image"), BarangNonHandmadeController.create);  
router.get('/barang-non-handmade', BarangNonHandmadeController.getAll);  
router.get('/barang-non-handmade/:id', BarangNonHandmadeController.getById);  
router.put('/barang-non-handmade/:id', upload.single("image"), BarangNonHandmadeController.update);  
router.delete('/barang-non-handmade/:id', BarangNonHandmadeController.delete);  
  
module.exports = router;  
