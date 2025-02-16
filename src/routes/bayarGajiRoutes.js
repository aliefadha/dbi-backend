const express = require('express');  
const router = express.Router();  
const BayarGajiController = require('../controllers/bayarGajiController');  

router.post('/bayar-gaji', BayarGajiController.create);  
router.get('/bayar-gaji', BayarGajiController.getAll);  
router.get('/bayar-gaji/:id', BayarGajiController.getById);  
router.put('/bayar-gaji/:id', BayarGajiController.update);  
router.delete('/bayar-gaji/:id', BayarGajiController.delete);  
  
module.exports = router;  
