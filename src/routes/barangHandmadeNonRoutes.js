const express = require("express");
const BarangNonHandmadeController = require("../controllers/barangNonHandmadeController");


const router = express.Router();

router.post("/barang-handmadenon", BarangNonHandmadeController.create);
router.get("/barang-handmadenon", BarangNonHandmadeController.getAll);
router.get("/barang-handmadenon/:id", BarangNonHandmadeController.getById);
router.put("/barang-handmadenon/:id", BarangNonHandmadeController.update);

module.exports = router;
