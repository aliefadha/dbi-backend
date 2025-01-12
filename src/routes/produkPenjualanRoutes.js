const express = require("express");
const ProdukPenjualanController = require("../controllers/produkPenjualanController");

const router = express.Router();

router.get("/produk-penjualan", ProdukPenjualanController.getAll);

module.exports = router;
