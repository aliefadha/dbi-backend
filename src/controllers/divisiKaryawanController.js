const DivisiKaryawanService = require("../services/divisiKaryawanService");  
  
class DivisiKaryawanController {  
  static async create(req, res) {  
    try {  
      const divisiKaryawan = await DivisiKaryawanService.create(req.body);  
      res.status(201).json({  
        success: true,  
        data: divisiKaryawan,  
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
      const divisiKaryawans = await DivisiKaryawanService.getAll();  
      res.status(200).json({  
        success: true,  
        data: divisiKaryawans,  
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
      const divisiKaryawan = await DivisiKaryawanService.getById(req.params.id);  
      if (!divisiKaryawan) {  
        return res.status(404).json({  
          success: false,  
          data: null,  
          message: "not found",  
        });  
      }  
      res.status(200).json({  
        success: true,  
        data: divisiKaryawan,  
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
      const divisiKaryawan = await DivisiKaryawanService.update(req.params.id, req.body);  
      if (!divisiKaryawan) {  
        return res.status(404).json({  
          success: false,  
          data: null,  
          message: "not found",  
        });  
      }  
      res.status(200).json({  
        success: true,  
        data: divisiKaryawan,  
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
      const deleted = await DivisiKaryawanService.delete(req.params.id);  
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
  static async getKaryawanByDivisi(req, res) {
      try {
          const divisi = await DivisiKaryawanService.getKaryawanByDivisi(req.params.id);
          if (!divisi) {
              return res.status(404).json({
                  success: false,
                  data: null,
                  message: "Data not found",
              });
          }
          res.status(200).json({
              success: true,
              data: divisi,
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
}  
  
module.exports = DivisiKaryawanController;  
