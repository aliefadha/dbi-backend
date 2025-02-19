const LaporanKeuanganService = require("../services/laporanKeuanganService");

class LaporanKeuanganController {

  static async getKategori(req, res) {
    try {
      const laporanKeuangans = await LaporanKeuanganService.getKategori();
      res.status(200).json({
        success: true,
        data: laporanKeuangans,
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
 
  static async getAll(req, res) {
    const { toko_id, startDate, endDate} = req.query;
    try {
      const laporanKeuangans = await (toko_id == 1
        ? LaporanKeuanganService.getGudang(startDate, endDate)
        : LaporanKeuanganService.getAll(toko_id, startDate, endDate));

      res.status(200).json({
        success: true,
        data: laporanKeuangans,
        message: "retrieved successfully",
      });
    }
    catch (error) {
      res.status(500).json({
        success: false,
        data: null,
        message: error.message,
      });
    }
  }

  static async getPemasukan(req, res) {
    const { toko_id, startDate, endDate } = req.query;
    try {
      const laporanKeuangans = await (toko_id == 1
       ? LaporanKeuanganService.getPemasukanGudang(startDate, endDate)
       : LaporanKeuanganService.getAllPemasukan(toko_id, startDate, endDate));
      res.status(200).json({
        success: true,
        data: laporanKeuangans,
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

  static async getPengeluaran(req, res) {
    const { toko_id, startDate, endDate } = req.query;
    try {
      const laporanKeuangans = await (toko_id == 1
      ? LaporanKeuanganService.getPengeluaranGudang(startDate, endDate)
      : LaporanKeuanganService.getAllPengeluaran(toko_id, startDate, endDate));
      res.status(200).json({
        success: true,
        data: laporanKeuangans,
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

module.exports = LaporanKeuanganController;
