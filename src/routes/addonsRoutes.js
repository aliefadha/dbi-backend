const express = require('express');  
const router = express.Router();  
const AddonsController = require('../controllers/addonsController');  

router.post('/addons', AddonsController.create);  
router.get('/addons', AddonsController.getAll);  
router.get('/addons/:id', AddonsController.getById);  
router.put('/addons/:id', AddonsController.update);  
router.delete('/addons/:id', AddonsController.delete); 

router.post('/rincian-biaya', AddonsController.createRincian);
router.get('/rincian-biaya', AddonsController.getAllRincian);

router.post('/packaging-per-barang', AddonsController.createPackaging)
router.get('/packaging-per-barang', AddonsController.getAllPackaging);

  
module.exports = router;  
