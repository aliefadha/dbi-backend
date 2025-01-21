const express = require('express');  
const router = express.Router();  
const CatatanController = require('../controllers/catatanController');  

router.post('/catatan', CatatanController.create);  
router.get('/catatan', CatatanController.getAll);  
router.get('/catatan/:id', CatatanController.getById);  
router.put('/catatan/:id', CatatanController.update);  
router.delete('/catatan/:id', CatatanController.delete);  
  
module.exports = router;  
