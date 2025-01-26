const express = require('express');  
const router = express.Router();  
const OperasionalStaffGudangController = require('../controllers/operasionalStaffGudangController');  

router.post('/operasional-staff-gudang', OperasionalStaffGudangController.create);  
router.get('/operasional-staff-gudang', OperasionalStaffGudangController.getAll);  
router.get('/operasional-staff-gudang/:id', OperasionalStaffGudangController.getById);  
router.put('/operasional-staff-gudang/:id', OperasionalStaffGudangController.update);  
router.delete('/operasional-staff-gudang/:id', OperasionalStaffGudangController.delete);  
  
module.exports = router;  
