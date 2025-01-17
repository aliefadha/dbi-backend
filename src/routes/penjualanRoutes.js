const express = require("express");
const PenjualanController = require("../controllers/penjualanController");


const router = express.Router();

router.post("/penjualan", PenjualanController.create);
router.get("/penjualan", PenjualanController.getAll);
router.get("/penjualan/:id", PenjualanController.getById);

module.exports = router;
