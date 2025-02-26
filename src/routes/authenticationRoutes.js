const express = require('express');  
const router = express.Router();  
const {AuthenticationController, upload} = require('../controllers/authenticationController');  

// router.post('/login', AuthenticationController.login); 
router.get('/logout', AuthenticationController.logout);
router.get('/authentication/:id', AuthenticationController.getById);
router.put('/authentication/:id', upload.single("image"), AuthenticationController.update);

module.exports = router;  
