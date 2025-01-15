const express = require("express");
const {KaryawanController , upload} = require("../controllers/karyawanController");

const router = express.Router();

router.get("/karyawan", KaryawanController.getAll);
router.post("/karyawan", upload.single("image"), KaryawanController.create);
router.get("/karyawan/:id", KaryawanController.getById);
router.put("/karyawan/:id", upload.single("image"), KaryawanController.update);
router.delete("/karyawan/:id", KaryawanController.delete);

module.exports = router;