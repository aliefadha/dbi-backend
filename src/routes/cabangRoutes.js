const express = require('express');  
const router = express.Router();  
const CabangController = require('../controllers/cabangController');  

router.post('/cabang', CabangController.create);  
router.get('/cabang', CabangController.getAll);  
router.get('/cabang/:id', CabangController.getById);  
router.put('/cabang/:id', CabangController.update);  
router.delete('/cabang/:id', CabangController.delete);  
  
module.exports = router;  
