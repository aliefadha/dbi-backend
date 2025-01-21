const express = require('express');  
const router = express.Router();  
const {BarangCustomController, upload} = require('../controllers/barangCustomController');  

router.post('/barang-custom', upload.single("image"), BarangCustomController.create);  
router.get('/barang-custom', BarangCustomController.getAll);  
router.get('/barang-custom/:id', BarangCustomController.getById);  
router.put('/barang-custom/:id', upload.single("image"), BarangCustomController.update);  
router.delete('/barang-custom/:id', BarangCustomController.delete);  
  
module.exports = router;  
