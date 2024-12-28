const express = require("express");
const TokoController = require("../controllers/tokoController");

const router = express.Router();

router.post("/toko", TokoController.create);
router.get("/toko", TokoController.getAll);
router.get("/toko/:id", TokoController.getById);
router.put("/toko/:id", TokoController.update);
router.delete("/toko/:id", TokoController.delete);

module.exports = router;
