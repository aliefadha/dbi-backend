const express = require('express');  
const router = express.Router();  
const { AbsensiKaryawanController, upload } = require('../controllers/absensiKaryawanController');  

router.post('/absensi-karyawan', upload.single("image"), AbsensiKaryawanController.create);  
router.get('/absensi-karyawan/:bulan/:tahun', AbsensiKaryawanController.getAll);  
router.get('/absensi-karyawan/:id', AbsensiKaryawanController.getById);  
router.put('/absensi-karyawan/:id', AbsensiKaryawanController.update);  
router.get('/list-absensi-karyawan/:id/:bulan/:tahun/karyawan', AbsensiKaryawanController.getListAbsensiByKaryawan);
router.get('/data-absensi-karyawan/:id/:bulan/:tahun/karyawan', AbsensiKaryawanController.getDataAbsensiByKaryawan);
router.delete('/absensi-karyawan/:id', AbsensiKaryawanController.delete);  
  
module.exports = router;  
