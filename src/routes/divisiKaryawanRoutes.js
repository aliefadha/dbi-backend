const express = require("express");
const DivisiKaryawanController = require("../controllers/divisiKaryawanController");

const router = express.Router();

router.post("/divisi-karyawan", DivisiKaryawanController.create);
router.get("/divisi-karyawan", DivisiKaryawanController.getAll);
router.get("/divisi-karyawan/:id", DivisiKaryawanController.getById);
router.get("/divisi-karyawan/:id/karyawan", DivisiKaryawanController.getKaryawanByDivisi);

module.exports = router;