const express = require("express");
const KategoriBarangController = require("../controllers/kategoriBarangController");

const router = express.Router();

router.post("/jenis-barang", KategoriBarangController.create);
router.get("/jenis-barang", KategoriBarangController.getAll);
router.get("/jenis-barang/:id", KategoriBarangController.getById);
router.put('/jenis-barang/:id', KategoriBarangController.update);  
router.delete('/jenis-barang/:id', KategoriBarangController.delete);


module.exports = router;
