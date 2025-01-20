const express = require('express');  
const router = express.Router();  
const BarangMentahController = require('../controllers/barangMentahController');  

router.post('/barang-mentah', BarangMentahController.create);  
router.get('/barang-mentah', BarangMentahController.getAll);  
router.get('/barang-mentah/:id', BarangMentahController.getById);  
router.put('/barang-mentah/:id', BarangMentahController.update);  
router.delete('/barang-mentah/:id', BarangMentahController.delete);  
  
module.exports = router;  
