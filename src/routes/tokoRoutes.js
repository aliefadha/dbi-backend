const express = require('express');  
const router = express.Router();  
const {TokoController, upload} = require('../controllers/tokoController');  

router.post('/toko', upload.single("image"),  TokoController.create);  
router.get('/toko', TokoController.getAll);  
router.get('/toko/:id', TokoController.getById);  
router.put('/toko/:id', upload.single("image"), TokoController.update);  
router.delete('/toko/:id', TokoController.delete);  
  
module.exports = router;  
