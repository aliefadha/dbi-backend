const express = require('express');  
const router = express.Router();  
const BarangController = require('../controllers/barangController');  

router.post('/barang', BarangController.create);
router.post('/barang/handmade', BarangController.createHandmades);
router.post('/barang/nonhandmade', BarangController.createNonHandmade);
router.post('/barang/custom', BarangController.createCustom);
router.get('/barang', BarangController.getAll);  
router.get('/barang/:id', BarangController.getById); 
router.put('/barang/:id', BarangController.update);  
router.delete('/barang/:id', BarangController.delete);  
  
module.exports = router;  
