const express = require("express");
const BarangHandmadeNonController = require("../controllers/barangHandmadeNonController");

const router = express.Router();

router.post("/barang-handmadenon", BarangHandmadeNonController.create);
router.get("/barang-handmadenon", BarangHandmadeNonController.getAll);
router.get("/barang-handmadenon/:id", BarangHandmadeNonController.getById);

module.exports = router;
