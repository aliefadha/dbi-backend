const express = require("express");
const PackagingController = require("../controllers/packagingController");
const router = express.Router();

router.post("/packaging", PackagingController.create);
router.get("/packaging", PackagingController.getAll);
router.get("/packaging/:id", PackagingController.getById);
router.put("/packaging/:id", PackagingController.update);
router.delete("/packaging/:id", PackagingController.delete);

module.exports = router;
