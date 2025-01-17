const express = require("express");
const BarangNonHandmadeController = require("../controllers/barangNonHandmadeController");


const router = express.Router();

router.post("/barang-nonhandmade", BarangNonHandmadeController.create);
router.get("/barang-nonhandmade", BarangNonHandmadeController.getAll);
router.get("/barang-nonhandmade/:id", BarangNonHandmadeController.getById);
router.put("/barang-nonhandmade/:id", BarangNonHandmadeController.update);
router.delete("/barang-nonhandmade/:id", BarangNonHandmadeController.delete);

module.exports = router;
