const Toko = require("../models/toko");
const LaporanKeuanganService = require("./laporanKeuanganService");

class TokoService {
  static async create(data) {
    try {
      const exsistingToko = await Toko.findOne({
        where: {
          email: data.email
        }
      })
      if (exsistingToko) {
        throw new Error("Email already exists");
      }
      const toko = await Toko.create(data);
      return toko;
    } catch (error) {
      throw error;
    }
  }

  static async getAll() {
    return await Toko.findAll({
      where: {
        is_deleted: false
      }
    });
  }

  static async getById(id) {
    return await Toko.findOne({
      where: {
        toko_id: id,
        is_deleted: false
      }
    });
  }

  static async update(id, data) {
    const toko = await Toko.findByPk(id);
    // const emailToko = await Toko.findOne({
    //   where: {
    //     email: data.email
    //   }
    // })
    // if(emailToko) throw new Error("Email already exists");
    if (!toko) return null;

    Object.assign(toko, data);
    await toko.save();

    return toko;
  }

  static async delete(id) {
    const toko = await Toko.findByPk(id);
    if (!toko) return null;
    await toko.update({ is_deleted: true });
    return true;
  }

  static async tokoTerlaris(startDate, endDate) {
    const tokoId = await Toko.findAll({
      attributes: ['toko_id', 'nama_toko'],
      where: {
        is_deleted: false
      },
      raw: true,
    });

    const tokoIdArray = tokoId.map(item => ({ toko_id: item.toko_id, nama_toko: item.nama_toko }));
    const laporanPerToko = await Promise.all(
      tokoIdArray.map(async (toko) => {
        const laporan = toko.toko_id === 1 
          ? await LaporanKeuanganService.getGudang(startDate, endDate)
          : await LaporanKeuanganService.getAll(toko.toko_id, startDate, endDate);

        return {
          toko_id: toko.toko_id,
          nama_toko: toko.nama_toko,
          keuntungan: laporan.keuntungan,
          total_pemasukan: laporan.total_pemasukan,
          total_pengeluaran: laporan.total_pengeluaran,
          produk_terjual: laporan.produk_terjual
        };
      })
    );

    // Get top performer for each category
    const topPemasukan = laporanPerToko.reduce((max, curr) =>
      curr.total_pemasukan > max.total_pemasukan ? curr : max
    );
    const topKeuntungan = laporanPerToko.reduce((max, curr) =>
      curr.keuntungan > max.keuntungan ? curr : max
    );
    const topPengeluaran = laporanPerToko.reduce((max, curr) =>
      curr.total_pengeluaran > max.total_pengeluaran ? curr : max
    );
    const topProduk = laporanPerToko.reduce((max, curr) =>
      curr.produk_terjual > max.produk_terjual ? curr : max
    );

    return {
      toko: laporanPerToko,
      toko_terlaris: {
        pemasukan_tertinggi: topPemasukan,
        keuntungan_tertinggi: topKeuntungan,
        pengeluaran_tertinggi: topPengeluaran,
        penjualan_terbanyak: topProduk
      }
    };
  }

}

module.exports = TokoService;
