const express = require("express");
const {KaryawanController , upload} = require("../controllers/karyawanController");

const router = express.Router();

router.get("/karyawan", KaryawanController.getAll);
router.post("/karyawan", upload.single("image"), KaryawanController.create);
router.get("/karyawan/:id", KaryawanController.getById);
router.put("/karyawan/:id", upload.single("image"), KaryawanController.update);
router.delete("/karyawan/:id", KaryawanController.delete);
router.get('/karyawan-user/:id', KaryawanController.getByUserId);
router.put('/karyawan-user/:id', upload.single("image"), KaryawanController.updateByUserId);

module.exports = router;