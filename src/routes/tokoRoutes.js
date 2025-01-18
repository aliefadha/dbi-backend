const express = require('express');  
const router = express.Router();  
const TokoController = require('../controllers/tokoController');  

router.post('/toko', TokoController.create);  
router.get('/toko', TokoController.getAll);  
router.get('/toko/:id', TokoController.getById);  
router.put('/toko/:id', TokoController.update);  
router.delete('/toko/:id', TokoController.delete);  
  
module.exports = router;  
