const express = require('express');  
const router = express.Router();  
const CutiKaryawanController = require('../controllers/cutiKaryawanController');  

router.post('/cuti-karyawan', CutiKaryawanController.create);  
router.get('/cuti-karyawan/:bulan/:tahun', CutiKaryawanController.getAll);  
router.get('/cuti-karyawan/:id', CutiKaryawanController.getById);  
router.put('/cuti-karyawan/:id', CutiKaryawanController.update);  
router.get('/cuti-by-karyawan/:id', CutiKaryawanController.getByKaryawanId); 
router.delete('/cuti-karyawan/:id', CutiKaryawanController.delete); 

  
module.exports = router;  
