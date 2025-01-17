const KategoriBarangService = require("../services/kategoriBarangService");

class KategoriBarangController {
    static async create(req, res) {
        try {
            const kategori = await KategoriBarangService.create(req.body);
            res.status(201).json({
                success: true,
                data: kategori,
                message: "Created successfully"
            })
        } catch (error) {
            res.status(400).json({
                success: false,
                data: null,
                message: error.message,
            })
        }
    }

    static async getAll(req, res) {
        try {
            const kategori = await KategoriBarangService.getAll();
            res.status(200).json({
                success: true,
                data: kategori,
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

    static async getById(req, res) {
        try {
            const kategori = await KategoriBarangService.getById(req.params.id);
            if (!kategori) {
                return res.status(404).json({
                    success: false,
                    data: null,
                    message: "Data not found",
                });
            }
            res.status(200).json({
                success: true,
                data: kategori,
                message: "retrieved successfully",
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                data: null,
                message: error.message,
            })
        }
    }
    static async getBarangByKategori(req, res) {
        try {
            const kategori = await KategoriBarangService.getBarangByKategori(req.params.id);
            if (!kategori) {
                return res.status(404).json({
                    success: false,
                    data: null,
                    message: "Data not found",
                });
            }
            res.status(200).json({
                success: true,
                data: kategori,
                message: "retrieved successfully",
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                data: null,
                message: error.message,
            })
        }
    }

    static async update(req, res) {  
        try {  
          const kategoriBarang = await KategoriBarangService.update(req.params.id, req.body);  
          if (!kategoriBarang) {  
            return res.status(404).json({  
              success: false,  
              data: null,  
              message: "not found",  
            });  
          }  
          res.status(200).json({  
            success: true,  
            data: kategoriBarang,  
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
          const deleted = await KategoriBarangService.delete(req.params.id);  
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

module.exports = KategoriBarangController;