const express = require("express");
const RincianBiayaController = require("../controllers/rincianBiayaController");

const router = express.Router();

router.post("/rincian-biaya", RincianBiayaController.create);
router.get("/rincian-biaya", RincianBiayaController.getAll);
router.get("/rincian-biaya/:id", RincianBiayaController.getById);
router.put("/rincian-biaya/:id", RincianBiayaController.update);
router.delete("/rincian-biaya/:id", RincianBiayaController.delete);

module.exports = router;
