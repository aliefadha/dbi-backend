const express = require('express');  
const router = express.Router();  
const { AbsensiKaryawanController, upload } = require('../controllers/absensiKaryawanController');  

router.post('/absensi-karyawan', upload.single("image"), AbsensiKaryawanController.create);  
router.get('/absensi-karyawan', AbsensiKaryawanController.getAll);  
router.get('/absensi-karyawan/:id', AbsensiKaryawanController.getById);  
router.put('/absensi-karyawan/:id', AbsensiKaryawanController.update);  
router.delete('/absensi-karyawan/:id', AbsensiKaryawanController.delete);  
  
module.exports = router;  
