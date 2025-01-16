const express = require('express');  
const router = express.Router();  
const KpiKaryawanController = require('../controllers/kpiKaryawanController');  

router.post('/kpi-karyawan', KpiKaryawanController.create);  
router.get('/kpi-karyawan', KpiKaryawanController.getAll);  
router.get('/kpi-karyawan/:id', KpiKaryawanController.getById);  
router.put('/kpi-karyawan/:id', KpiKaryawanController.update);  
router.delete('/kpi-karyawan/:id', KpiKaryawanController.delete);  
  
module.exports = router;  
