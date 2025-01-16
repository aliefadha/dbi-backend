const express = require('express');  
const router = express.Router();  
const BarangCustomController = require('../controllers/barangCustomController');  

router.post('/barang-custom', BarangCustomController.create);  
router.get('/barang-custom', BarangCustomController.getAll);  
router.get('/barang-custom/:id', BarangCustomController.getById);  
router.put('/barang-custom/:id', BarangCustomController.update);  
router.delete('/barang-custom/:id', BarangCustomController.delete);  
  
module.exports = router;  
