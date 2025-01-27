const express = require('express');  
const router = express.Router();  
const {PackagingGudangController, upload} = require('../controllers/packagingGudangController');  

router.post('/packaging-gudang', upload.single("image"), PackagingGudangController.create);  
router.get('/packaging-gudang', PackagingGudangController.getAll);  
router.get('/packaging-gudang/:id', PackagingGudangController.getById);  
router.put('/packaging-gudang/:id', upload.single("image"), PackagingGudangController.update);  
router.delete('/packaging-gudang/:id', PackagingGudangController.delete);  
  
module.exports = router;  
