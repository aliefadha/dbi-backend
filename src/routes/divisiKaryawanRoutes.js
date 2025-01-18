const express = require('express');  
const router = express.Router();  
const DivisiKaryawanController = require('../controllers/divisiKaryawanController');  

router.post('/divisi-karyawan', DivisiKaryawanController.create);  
router.get('/divisi-karyawan', DivisiKaryawanController.getAll);  
router.get('/divisi-karyawan/:id', DivisiKaryawanController.getById);  
router.get("/divisi-karyawan/:id/karyawan", DivisiKaryawanController.getKaryawanByDivisi);
router.put('/divisi-karyawan/:id', DivisiKaryawanController.update);  
router.delete('/divisi-karyawan/:id', DivisiKaryawanController.delete);  
  
module.exports = router;  
