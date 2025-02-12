const express = require('express');  
const router = express.Router();  
const PemasukanController = require('../controllers/pemasukanController');  

router.post('/pemasukan', PemasukanController.create);  
router.get('/pemasukan', PemasukanController.getAll);  
router.get('/pemasukan/:id', PemasukanController.getById);  
router.put('/pemasukan/:id', PemasukanController.update);  
router.delete('/pemasukan/:id', PemasukanController.delete);  
  
module.exports = router;  
