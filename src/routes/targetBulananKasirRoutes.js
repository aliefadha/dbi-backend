const express = require('express');  
const router = express.Router();  
const TargetBulananKasirController = require('../controllers/targetBulananKasirController');  

router.post('/target-bulanan-kasir', TargetBulananKasirController.create);  
router.get('/target-bulanan-kasir', TargetBulananKasirController.getAll);  
router.get('/target-bulanan-kasir/:id', TargetBulananKasirController.getById);  
router.put('/target-bulanan-kasir/:id', TargetBulananKasirController.update);  
router.delete('/target-bulanan-kasir/:id', TargetBulananKasirController.delete); 
router.get('/target-bulanan-kasrir/:id/cabang', TargetBulananKasirController.getTargetByCabang); 
  
module.exports = router;  
