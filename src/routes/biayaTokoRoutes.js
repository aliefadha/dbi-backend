const express = require('express');  
const router = express.Router();  
const BiayaTokoController = require('../controllers/biayaTokoController');  

router.post('/biaya-toko', BiayaTokoController.create);  
router.get('/biaya-toko', BiayaTokoController.getAll);  
router.get('/biaya-toko/:id', BiayaTokoController.getById);  
router.put('/biaya-toko/:id', BiayaTokoController.update);  
router.delete('/biaya-toko/:id', BiayaTokoController.delete);  
  
module.exports = router;  
