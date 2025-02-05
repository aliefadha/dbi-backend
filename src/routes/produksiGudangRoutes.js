const express = require('express');  
const router = express.Router();  
const {ProduksiGudangController, upload} = require('../controllers/produksiGudangController');  

router.post('/produksi-gudang', upload.single("image"), ProduksiGudangController.create);  
router.get('/produksi-gudang', ProduksiGudangController.getAll);  
router.get('/produksi-gudang/:id', ProduksiGudangController.getById);  
router.put('/produksi-gudang/:id', upload.single("image"), ProduksiGudangController.update);  
router.delete('/produksi-gudang/:id', ProduksiGudangController.delete);  
  
module.exports = router;  
