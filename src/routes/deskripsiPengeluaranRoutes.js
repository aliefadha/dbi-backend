const express = require('express');  
const router = express.Router();  
const DeskripsiPengeluaranController = require('../controllers/deskripsiPengeluaranController');  

router.post('/deskripsi-pengeluaran', DeskripsiPengeluaranController.create);  
router.get('/deskripsi-pengeluaran', DeskripsiPengeluaranController.getAll);  
router.get('/deskripsi-pengeluaran/:id', DeskripsiPengeluaranController.getById);  
router.put('/deskripsi-pengeluaran/:id', DeskripsiPengeluaranController.update);  
router.delete('/deskripsi-pengeluaran/:id', DeskripsiPengeluaranController.delete);  
  
module.exports = router;  
