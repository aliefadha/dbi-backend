const express = require('express');  
const router = express.Router();  
const AuthenticationController = require('../controllers/authenticationController');  

router.post('/login', AuthenticationController.login); 
router.put('/authentication/:id', AuthenticationController.update);
  
module.exports = router;  
