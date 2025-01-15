const express = require('express');  
const router = express.Router();  
const CutiKaryawanController = require('../controllers/cutiKaryawanController');  

router.post('/cuti-karyawan', CutiKaryawanController.create);  
router.get('/cuti-karyawan', CutiKaryawanController.getAll);  
router.get('/cuti-karyawan/:id', CutiKaryawanController.getById);  
router.put('/cuti-karyawan/:id', CutiKaryawanController.update);  
router.delete('/cuti-karyawan/:id', CutiKaryawanController.delete);  
  
module.exports = router;  
