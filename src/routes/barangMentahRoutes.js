const express = require('express');  
const router = express.Router();  
const {BarangMentahController, upload} = require('../controllers/barangMentahController');  

router.post('/barang-mentah', upload.single("image"), BarangMentahController.create);  
router.get('/barang-mentah', BarangMentahController.getAll);  
router.get('/barang-mentah/:id', BarangMentahController.getById);  
router.put('/barang-mentah/:id', upload.single("image"), BarangMentahController.update);  
router.delete('/barang-mentah/:id', BarangMentahController.delete);  
  
module.exports = router;  
