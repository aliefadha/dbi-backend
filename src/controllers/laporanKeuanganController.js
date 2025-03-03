const LaporanKeuanganService = require("../services/laporanKeuanganService");
const XLSX = require('xlsx');
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
    const { toko_id, startDate, endDate, kategori_pemasukan_id, kategori_pengeluaran_id} = req.query;
    try {
      const laporanKeuangans = await (toko_id == 1
        ? LaporanKeuanganService.getGudang(startDate, endDate, kategori_pemasukan_id, kategori_pengeluaran_id)
        : LaporanKeuanganService.getAll(toko_id, startDate, endDate, kategori_pemasukan_id, kategori_pengeluaran_id));

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

  static async export(req, res) {
    try {
      const { toko_id, startDate, endDate, kategori_pemasukan_id, kategori_pengeluaran_id } = req.query;
      const workbook = await LaporanKeuanganService.exportToExcel(toko_id, startDate, endDate, kategori_pemasukan_id, kategori_pengeluaran_id);
      res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
      res.setHeader("Content-Disposition", "attachment; filename=laporan_keuangan.xlsx");
      const buffer = XLSX.write(workbook, { type: "buffer", bookType: "xlsx" });
      res.send(buffer);
    } catch (error) {
      console.error("Error exporting to Excel:", error);
      res.status(500).json({
        success: false,
        data: null,
        message: error.message,
      });
    }
  }
}

module.exports = LaporanKeuanganController;
