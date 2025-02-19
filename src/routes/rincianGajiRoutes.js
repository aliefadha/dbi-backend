const express = require('express');  
const router = express.Router();  
const RincianGajiController = require('../controllers/rincianGajiController');  

router.post('/rincian-gaji', RincianGajiController.create);  
router.get('/rincian-gaji', RincianGajiController.getAll);  
router.get('/rincian-gaji/:id', RincianGajiController.getById);  
router.put('/rincian-gaji/:id', RincianGajiController.update);  
router.delete('/rincian-gaji/:id', RincianGajiController.delete);  
  
module.exports = router;  
