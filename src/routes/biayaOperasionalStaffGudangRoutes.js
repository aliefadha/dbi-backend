const express = require('express');  
const router = express.Router();  
const BiayaOperasionalStaffGudangController = require('../controllers/biayaOperasionalStaffGudangController');  

router.get('/biaya-operasional-staff-gudang', BiayaOperasionalStaffGudangController.getAll);
  
module.exports = router;  
