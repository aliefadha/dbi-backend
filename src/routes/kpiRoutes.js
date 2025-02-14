const express = require('express');  
const router = express.Router();  
const KpiController = require('../controllers/kpiController');  

router.post('/kpi', KpiController.create);  
router.get('/kpi', KpiController.getAll);  
router.get('/kpi/:id', KpiController.getById);  
router.put('/kpi/:id', KpiController.update);  
router.delete('/kpi/:id', KpiController.delete);
router.get('/kpi-divisi', KpiController.getKpiByDivisi);  
router.get('/get-divisi-kpi', KpiController.getDivisiKpi);  
router.get('/manager-kpi', KpiController.getManagerKpi);
router.get('/manager-kpi-divisi', KpiController.getManagerKpiByDivisi);
router.get('/manager-kpi-list', KpiController.getManagerKpiList);
  
module.exports = router;  
