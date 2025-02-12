const express = require('express');  
const router = express.Router();  
const DeskripsiPemasukanController = require('../controllers/deskripsiPemasukanController');  

router.post('/deskripsi-pemasukan', DeskripsiPemasukanController.create);  
router.get('/deskripsi-pemasukan', DeskripsiPemasukanController.getAll);  
router.get('/deskripsi-pemasukan/:id', DeskripsiPemasukanController.getById);  
router.put('/deskripsi-pemasukan/:id', DeskripsiPemasukanController.update);  
router.delete('/deskripsi-pemasukan/:id', DeskripsiPemasukanController.delete);  
  
module.exports = router;  
