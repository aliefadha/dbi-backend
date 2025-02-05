const express = require('express');  
const router = express.Router();  
const RincianBiayaCustomController = require('../controllers/rincianBiayaCustomController');  

router.post('/rincian-biaya-custom', RincianBiayaCustomController.create);  
router.get('/rincian-biaya-custom', RincianBiayaCustomController.getAll);  
router.get('/rincian-biaya-custom/:id', RincianBiayaCustomController.getById);  
router.put('/rincian-biaya-custom/:id', RincianBiayaCustomController.update);  
router.delete('/rincian-biaya-custom/:id', RincianBiayaCustomController.delete);  
  
module.exports = router;  
