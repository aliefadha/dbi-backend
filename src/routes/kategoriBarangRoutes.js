const express = require("express");
const KategoriBarangController = require("../controllers/kategoriBarangController");
const BarangHandmadeNonController = require("../controllers/barangHandmadeNonController");

const router = express.Router();

router.post("/kategori-barang", KategoriBarangController.create);
router.get("/kategori-barang", KategoriBarangController.getAll);
router.get("/kategori-barang/:id/barang", BarangHandmadeNonController.getBarangByKategori);
router.get("/kategori-barang/:id", KategoriBarangController.getById);


module.exports = router;
