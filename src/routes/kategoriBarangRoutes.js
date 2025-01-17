const express = require("express");
const KategoriBarangController = require("../controllers/kategoriBarangController");

const router = express.Router();

router.post("/kategori-barang", KategoriBarangController.create);
router.get("/kategori-barang", KategoriBarangController.getAll);
router.get("/kategori-barang/:id", KategoriBarangController.getById);
router.put('/kategori-barang/:id', KategoriBarangController.update);  
router.delete('/kategori-barang/:id', KategoriBarangController.delete);


module.exports = router;
