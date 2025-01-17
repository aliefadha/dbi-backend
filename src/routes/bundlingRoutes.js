const express = require('express');  
const router = express.Router();  
const BundlingController = require('../controllers/bundlingController');  

router.post('/bundling', BundlingController.create);  
router.get('/bundling', BundlingController.getAll);  
router.get('/bundling/:id', BundlingController.getById);  
router.put('/bundling/:id', BundlingController.update);  
router.delete('/bundling/:id', BundlingController.delete);  
  
module.exports = router;  
