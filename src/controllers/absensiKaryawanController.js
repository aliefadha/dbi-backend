const AbsensiKaryawanService = require("../services/absensiKaryawanService");  
const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, "../../public/absensiKaryawan"));
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname));
    },
});

const upload = multer({ storage: storage });


class AbsensiKaryawanController {  
  static async create(req, res) {  
    try {  
      const absensiKaryawanData = {
        ...req.body,
        image: req.file.path
      }
      const absensiKaryawan = await AbsensiKaryawanService.create(absensiKaryawanData);  
      res.status(201).json({  
        success: true,  
        data: absensiKaryawan,  
        message: "created successfully",  
      });  
    } catch (error) {  
      res.status(400).json({  
        success: false,  
        data: null,  
        message: error.message,  
      });  
    }  
  }  
  
  static async getAll(req, res) {  
    try {  
      const absensiKaryawans = await AbsensiKaryawanService.getAll();  
      res.status(200).json({  
        success: true,  
        data: absensiKaryawans,  
        message: "retrieved successfully",  
      });  
    } catch (error) {  
      res.status(500).json({  
        success: false,  
        data: null,  
        message: error.message,  
      });  
    }  
  }  
  
  static async getById(req, res) {  
    try {  
      const absensiKaryawan = await AbsensiKaryawanService.getById(req.params.id);  
      if (!absensiKaryawan) {  
        return res.status(404).json({  
          success: false,  
          data: null,  
          message: "not found",  
        });  
      }  
      res.status(200).json({  
        success: true,  
        data: absensiKaryawan,  
        message: "retrieved successfully",  
      });  
    } catch (error) {  
      res.status(500).json({  
        success: false,  
        data: null,  
        message: error.message,  
      });  
    }  
  }  
  
  static async update(req, res) {  
    try {  
      const absensiKaryawan = await AbsensiKaryawanService.update(req.params.id, req.body);  
      if (!absensiKaryawan) {  
        return res.status(404).json({  
          success: false,  
          data: null,  
          message: "not found",  
        });  
      }  
      res.status(200).json({  
        success: true,  
        data: absensiKaryawan,  
        message: "updated successfully",  
      });  
    } catch (error) {  
      res.status(400).json({  
        success: false,  
        data: null,  
        message: error.message,  
      });  
    }  
  }  
  
  static async delete(req, res) {  
    try {  
      const deleted = await AbsensiKaryawanService.delete(req.params.id);  
      if (!deleted) {  
        return res.status(404).json({  
          success: false,  
          data: null,  
          message: "not found",  
        });  
      }  
      res.status(200).json({  
        success: true,  
        data: null,  
        message: "deleted successfully",  
      });  
    } catch (error) {  
      res.status(500).json({  
        success: false,  
        data: null,  
        message: error.message,  
      });  
    }  
  }  
}  
  
module.exports = { AbsensiKaryawanController, upload };  
