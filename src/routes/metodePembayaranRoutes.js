const express = require("express");
const MetodePembayaranController = require("../controllers/metodePembayaranController");

const router = express.Router();

router.get("/metode-pembayaran", MetodePembayaranController.getAll);

module.exports = router;
