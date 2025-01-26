const express = require('express');  
const router = express.Router();  
const BiayaGudangController = require('../controllers/biayaGudangController');  

router.post('/biaya-gudang', BiayaGudangController.create);  
router.get('/biaya-gudang', BiayaGudangController.getAll);  
router.get('/biaya-gudang/:id', BiayaGudangController.getById);  
router.put('/biaya-gudang/:id', BiayaGudangController.update);  
router.delete('/biaya-gudang/:id', BiayaGudangController.delete);  
  
module.exports = router;  
