const ProdukPenjualanGudangService = require("../services/produkPenjualanGudangService");
const ProdukPenjualanService = require("../services/produkPenjualanService");  
  
class ProdukPenjualanController {  
  static async create(req, res) {  
    try {  
      const produkPenjualan = await ProdukPenjualanService.create(req.body);  
      res.status(201).json({  
        success: true,  
        data: produkPenjualan,  
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
      const produkPenjualans = await ProdukPenjualanService.getAll();  
      res.status(200).json({  
        success: true,  
        data: produkPenjualans,  
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
      const produkPenjualan = await ProdukPenjualanService.getById(req.params.id);  
      if (!produkPenjualan) {  
        return res.status(404).json({  
          success: false,  
          data: null,  
          message: "not found",  
        });  
      }  
      res.status(200).json({  
        success: true,  
        data: produkPenjualan,  
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
      const produkPenjualan = await ProdukPenjualanService.update(req.params.id, req.body);  
      if (!produkPenjualan) {  
        return res.status(404).json({  
          success: false,  
          data: null,  
          message: "not found",  
        });  
      }  
      res.status(200).json({  
        success: true,  
        data: produkPenjualan,  
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
      const deleted = await ProdukPenjualanService.delete(req.params.id);  
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

  static async getAllTerlarisByToko(req, res) {
      try {  
        const { toko_id, startDate, endDate } = req.query;
        let produkTerlaris = [];

        if (toko_id === null || toko_id === undefined) {
            // Get data for both toko_id 
            const produkTerlarisGudang = await ProdukPenjualanGudangService.getAllTerlaris(startDate, endDate);
            const produkTerlarisToko = await ProdukPenjualanService.getAllTerlarisByToko(null, startDate, endDate);

            // Combine the results
            produkTerlaris = [...produkTerlarisGudang, ...produkTerlarisToko];
        } else if (toko_id == 1) {
            // Get data for toko_id 1
            produkTerlaris = await ProdukPenjualanGudangService.getAllTerlaris(startDate, endDate);
        } else {
          produkTerlaris = await ProdukPenjualanService.getAllTerlarisByToko(toko_id, startDate, endDate);
        }
        res.status(200).json({  
          success: true,  
          data: produkTerlaris,  
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

    static async getAllTerlarisByKategoriToko(req, res) {
      try {  
        const { toko_id, startDate, endDate } = req.query;
        let produkTerlaris = {};

        if (toko_id === null || toko_id === undefined) {
          const produkTerlarisGudang = await ProdukPenjualanGudangService.getAllTerlarisByKategori(startDate, endDate);
          const produkTerlarisToko = await ProdukPenjualanService.getAllTerlarisByKategoriToko(null, startDate, endDate);

          // Combine the results
          produkTerlaris = { 
            handmade: produkTerlarisGudang.handmade || produkTerlarisToko.handmade || null,
            nonhandmade: produkTerlarisGudang.nonhandmade || produkTerlarisToko.nonhandmade || null,
            mentah: produkTerlarisGudang.mentah || produkTerlarisToko.mentah || null,
            packaging: produkTerlarisGudang.packaging || produkTerlarisToko.packaging || null
          };
        } else if (toko_id == 1) {
          produkTerlaris = await ProdukPenjualanGudangService.getAllTerlarisByKategori(startDate, endDate);
        } else {
          produkTerlaris = await ProdukPenjualanService.getAllTerlarisByKategoriToko(toko_id, startDate, endDate);
        }
        res.status(200).json({  
          success: true,  
          data: produkTerlaris,  
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

    static async getAllTerlarisByKategoriCabang(req, res) {
      try {  
        const { cabang_id, startDate, endDate } = req.query;
        const produkTerlaris = cabang_id == 1 
          ? await ProdukPenjualanGudangService.getAllTerlarisByKategori(startDate, endDate)
          : await ProdukPenjualanService.getAllTerlarisByKategoriCabang(cabang_id, startDate, endDate);
        res.status(200).json({  
          success: true,  
          data: produkTerlaris,  
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

    static async getAllTerlarisByCabang(req, res) {
      try {  
        const { cabang_id, startDate, endDate } = req.query;
        const produkTerlaris = cabang_id == 1 
          ? await ProdukPenjualanGudangService.getAllTerlaris(startDate, endDate)
          : await ProdukPenjualanService.getAllTerlarisByCabang(cabang_id, startDate, endDate);
        
        res.status(200).json({  
          success: true,  
          data: produkTerlaris,  
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

    static async getToptenByToko(req, res) {
      try {
        const { toko_id, startDate, endDate } = req.query;
        let produkTopten = {};
        if (toko_id === null || toko_id === undefined) {
          // Fetch data from both services
          const produkToptenGudang = await ProdukPenjualanGudangService.getTopTenTerlaris(
            startDate ? new Date(startDate) : null,
            endDate ? new Date(endDate) : null
          );
          const produkToptenToko = await ProdukPenjualanService.getTopTenTerlarisByToko(
            null,
            startDate ? new Date(startDate) : null,
            endDate ? new Date(endDate) : null
          );

          // Combine the results
          produkTopten = [...produkToptenGudang, ...produkToptenToko];

          // Sort the combined results by total_terjual in descending order
          produkTopten.sort((a, b) => b.total_terjual - a.total_terjual);

          // Slice to get the top 10 products
          produkTopten = produkTopten.slice(0, 10);
        } else if (toko_id == 1) {
          // Get data for toko_id 1
          produkTopten = await ProdukPenjualanGudangService.getTopTenTerlaris(
            startDate? new Date(startDate) : null,
            endDate? new Date(endDate) : null
          );
        } else {
          // Get data for other toko_id
          produkTopten = await ProdukPenjualanService.getTopTenTerlarisByToko(
            toko_id,
            startDate? new Date(startDate) : null,
            endDate? new Date(endDate) : null
          );
        }
        res.status(200).json({
          success: true,
          data: produkTopten,
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

    static async getToptenByCabang(req, res) {
      try {
        const { cabang_id, startDate, endDate } = req.query;

        if(cabang_id == 1){
          const produkTopten = await ProdukPenjualanGudangService.getTopTenTerlaris(
            startDate? new Date(startDate) : null,
            endDate? new Date(endDate) : null
          );
          return res.status(200).json({
            success: true,
            data: produkTopten,
            message: "retrieved successfully",
          });
        }

        const produkTopten = await ProdukPenjualanService.getTopTenTerlarisByCabang(
          cabang_id,
          startDate? new Date(startDate) : null,
          endDate? new Date(endDate) : null
        );
        res.status(200).json({
          success: true,
          data: produkTopten,
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
  
module.exports = ProdukPenjualanController;
