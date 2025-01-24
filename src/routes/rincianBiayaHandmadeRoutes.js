const express = require('express');  
const router = express.Router();  
const RincianBiayaHandmadeController = require('../controllers/rincianBiayaHandmadeController');  

router.post('/rincian-biaya-handmade', RincianBiayaHandmadeController.create);  
router.get('/rincian-biaya-handmade', RincianBiayaHandmadeController.getAll);  
router.get('/rincian-biaya-handmade/:id', RincianBiayaHandmadeController.getById);  
router.put('/rincian-biaya-handmade/:id', RincianBiayaHandmadeController.update);  
router.delete('/rincian-biaya-handmade/:id', RincianBiayaHandmadeController.delete);  
  
module.exports = router;  
