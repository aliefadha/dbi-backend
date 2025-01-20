const express = require('express');  
const router = express.Router();  
const BiayaOperasionalStaffGudangController = require('../controllers/biayaOperasionalStaffGudangController');  

router.post('/biaya-operasional-staff-gudang', BiayaOperasionalStaffGudangController.create);  
router.get('/biaya-operasional-staff-gudang', BiayaOperasionalStaffGudangController.getAll);  
router.get('/biaya-operasional-staff-gudang/:id', BiayaOperasionalStaffGudangController.getById);  
router.put('/biaya-operasional-staff-gudang/:id', BiayaOperasionalStaffGudangController.update);  
router.delete('/biaya-operasional-staff-gudang/:id', BiayaOperasionalStaffGudangController.delete);  
  
module.exports = router;  
