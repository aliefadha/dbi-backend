const KaryawanService = require("../services/karyawanService");
const bcrypt = require("bcrypt");
const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, "../public/karyawan"));
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname));
    },
});

const upload = multer({ storage: storage });

class KaryawanController {
    static async getAll(req, res) {
        try {
            const karyawan = await KaryawanService.getAll();
            res.status(200).json({
                success: true,
                data: karyawan,
                message: "retrieved successfully"
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                data: null,
                message: error.message
            });
        }
    }

    static async create(req, res) {
        try {
            console.log(req.body);
            const hashPassword = bcrypt.hashSync(req.body.password, 10);
            const karyawanData = {
                ...req.body,
                password: hashPassword,
                image: req.file.filename
            }
            const karyawan = await KaryawanService.create(karyawanData);
            res.status(201).json({
                success: true,
                data: karyawan,
                message: "Karyawan created successfully"
            }); 
        } catch (error) {
            res.status(400).json({
                success: false,
                data: null,
                message: error.message
            });
        }
    }

    static async getById(req, res) {
        try {
            const karyawan = await KaryawanService.getById(req.params.id);
            if (!karyawan) {
                return res.status(404).json({
                    success: false,
                    data: null,
                    message: "Karyawan not found"
                });
            }
            res.status(200).json({
                success: true,
                data: karyawan,
                message: "retrieved successfully"
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                data: null,
                message: error.message
            });
        }
    }

    static async update(req, res) {
        try {
            const karyawan = await KaryawanService.update(req.params.id, req.body);
            if (!karyawan) {
                return res.status(404).json({
                    success: false,
                    data: null,
                    message: "Karyawan not found"
                });
            }
            res.status(200).json({
                success: true,
                data: karyawan,
                message: "Karyawan updated successfully"
            });
        } catch (error) {
            res.status(400).json({
                success: false,
                data: null,
                message: error.message
            });
        }
    }

    static async delete(req, res) {    
        try {
            const deleted = await KaryawanService.delete(req.params.id);
            if (!deleted) {
                return res.status(404).json({
                    success: false,
                    data: null,
                    message: "Karyawan not found"
                });
            }
            res.status(200).json({
                success: true,
                data: null,
                message: "Karyawan deleted successfully"
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                data: null,
                message: error.message
            });
        }
    }
}

module.exports = {KaryawanController, upload};