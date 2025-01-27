const express = require('express');  
const router = express.Router();  
const BiayaGudangController = require('../controllers/biayaGudangController');  

router.post('/biaya-gudang', BiayaGudangController.create);  
router.get('/biaya-gudang', BiayaGudangController.getAll);   
router.put('/biaya-gudang/:id', BiayaGudangController.update);  
  
module.exports = router;  
