const express = require("express");
const PenjualanController = require("../controllers/penjualanController");


const router = express.Router();

router.get("/penjualan", PenjualanController.getAll);

module.exports = router;
