const express = require("express");
const KategoriBarangController = require("../controllers/kategoriBarangController");

const router = express.Router();

router.post("/kategori-barang", KategoriBarangController.create);
router.get("/kategori-barang", KategoriBarangController.getAll);
router.get("/kategori-barang/:id", KategoriBarangController.getById);

module.exports = router;
