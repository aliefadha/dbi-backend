const express = require('express');  
const router = express.Router();  
const PackagingGudangController = require('../controllers/packagingGudangController');  

router.post('/packaging-gudang', PackagingGudangController.create);  
router.get('/packaging-gudang', PackagingGudangController.getAll);  
router.get('/packaging-gudang/:id', PackagingGudangController.getById);  
router.put('/packaging-gudang/:id', PackagingGudangController.update);  
router.delete('/packaging-gudang/:id', PackagingGudangController.delete);  
  
module.exports = router;  
