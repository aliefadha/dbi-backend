const express = require('express');  
const router = express.Router();  
const {PackagingController, upload} = require('../controllers/packagingController');  

router.post('/packaging', upload.single("image"), PackagingController.create);  
router.get('/packaging', PackagingController.getAll);  
router.get('/packaging/:id', PackagingController.getById);  
router.put('/packaging/:id', upload.single("image"), PackagingController.update);  
router.delete('/packaging/:id', PackagingController.delete);  
  
module.exports = router;  
