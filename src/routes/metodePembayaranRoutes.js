const express = require("express");
const MetodePembayaranController = require("../controllers/metodePembayaranController");

const router = express.Router();

router.post("/metode-pembayaran", MetodePembayaranController.create);
router.get("/metode-pembayaran", MetodePembayaranController.getAll);
router.get("/metode-pembayaran/:id", MetodePembayaranController.getById);
router.put("/metode-pembayaran/:id", MetodePembayaranController.update);
router.delete("/metode-pembayaran/:id", MetodePembayaranController.delete);

module.exports = router;
