const express = require('express');  
const router = express.Router();  
const KpiKaryawanController = require('../controllers/kpiKaryawanController');  

router.post('/kpi-karyawan', KpiKaryawanController.create);  
router.get('/kpi-karyawan/:bulan/:tahun', KpiKaryawanController.getAll);  
router.get('/kpi-karyawan/:id', KpiKaryawanController.getById);  
// router.put('/kpi-karyawan/:id', KpiKaryawanController.update);  
router.delete('/kpi-karyawan/:id', KpiKaryawanController.delete);
router.get('/kpi-karyawan/:id/:bulan/:tahun/karyawan', KpiKaryawanController.getByKaryawanId);  
  
module.exports = router;  
