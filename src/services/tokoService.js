const Cabang = require("../models/cabang");
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
    const tokoList = await Toko.findAll({
      where: {
        is_deleted: false
      }
    });

    const result = tokoList.map(toko => {
      const tokoData = {
          toko_id: toko.toko_id,
          image: toko.image,
          nama_toko: toko.nama_toko,
          email: toko.email,
          password: toko.password,
          detail_password: toko.detail_password,
          role: toko.role
      };

      // Add the new field only if toko_id is 1
      if (toko.toko_id === 1) {
          tokoData.nama_toko_lama = 'Rumah Produksi';
      }

      return tokoData;
    });

    return result;
  }

  static async getById(id) {
    const toko = await Toko.findOne({
      where: {
        toko_id: id,
        is_deleted: false
      }
    });

    const tokoData = {
        toko_id: toko.toko_id,
        image: toko.image,
        nama_toko: toko.nama_toko,
        email: toko.email,
        password: toko.password,
    };

    // Add the new field only if toko_id is 1
    if (toko.toko_id === 1) {
        tokoData.nama_toko_lama = 'Rumah Produksi';
    }

    return tokoData;
  }

  static async update(id, data) {
    try {
      const toko = await Toko.findByPk(id);
      if (!toko) return null;
      if (data.email) {
        const existingUser = await Toko.findOne({ where: { email: data.email } });
        if (existingUser && existingUser.toko_id != id) {
          throw new Error('Email already exists');
        }
      }
      Object.assign(toko, data);
      await toko.save();
  
      return toko;
    } catch (error) {
      throw error;
    }
  }

  static async delete(id) {
    const toko = await Toko.findByPk(id);
    if (!toko) return null;
    await toko.destroy();
    return true;
  }

  static async tokoTerlaris(toko_id = null, startDate, endDate) {
    let tokoId;
    
    if (!toko_id) {
      tokoId = await Toko.findAll({
        attributes: ['toko_id', 'nama_toko'],
        where: {
          is_deleted: false
        },
        raw: true,
      });
    } else {
      tokoId = await Toko.findAll({
        attributes: ['toko_id', 'nama_toko'],
        where: {
          toko_id: toko_id,
          is_deleted: false
        },
        raw: true,
      });
    }

    if (!tokoId || tokoId.length === 0) {
      throw new Error("No toko found");
    }

    const laporanPerToko = await Promise.all(
      tokoId.map(async (toko) => {
        if (toko.toko_id === 1) {
          const laporan = await LaporanKeuanganService.getGudang(startDate, endDate);
          return {
            toko_id: toko.toko_id,
            nama_toko: toko.nama_toko,
            keuntungan: laporan.keuntungan,
            total_pemasukan: laporan.total_pemasukan,
            total_pengeluaran: laporan.total_pengeluaran,
            produk_terjual: laporan.produk_terjual
          };
        } else {
          const cabangList = await Cabang.findAll({
            where: {
              toko_id: toko.toko_id,
              is_deleted: false
            },
            raw: true
          });

          const cabangReports = await Promise.all(
            cabangList.map(async (cabang) => {
              const laporan = await LaporanKeuanganService.getAll(toko.toko_id, cabang.cabang_id, startDate, endDate);
              return {
                cabang_id: cabang.cabang_id,
                nama_cabang: cabang.nama_cabang,
                keuntungan: laporan.keuntungan,
                total_pemasukan: laporan.total_pemasukan,
                total_pengeluaran: laporan.total_pengeluaran,
                produk_terjual: laporan.produk_terjual
              };
            })
          );
          
          const totalKeuntungan = cabangReports.reduce((sum, curr) => sum + (curr.keuntungan || 0), 0);
          const totalPemasukan = cabangReports.reduce((sum, curr) => sum + (curr.total_pemasukan || 0), 0);
          const totalPengeluaran = cabangReports.reduce((sum, curr) => sum + (curr.total_pengeluaran || 0), 0);
          const totalProduk = cabangReports.reduce((sum, curr) => sum + (curr.produk_terjual || 0), 0);

          return {
            toko_id: toko.toko_id,
            nama_toko: toko.nama_toko,
            keuntungan: totalKeuntungan,
            total_pemasukan: totalPemasukan,
            total_pengeluaran: totalPengeluaran,
            produk_terjual: totalProduk,
            cabang: cabangReports
          };
        }
      })
    );

    // Get top performer for each category
    const allData = toko_id ? 
      laporanPerToko[0]?.cabang || [] : 
      laporanPerToko;

    const topPemasukan = allData.reduce((max, curr) =>
      curr.total_pemasukan > max.total_pemasukan ? curr : max, allData[0]
    );
    const topKeuntungan = allData.reduce((max, curr) =>
      curr.keuntungan > max.keuntungan ? curr : max, allData[0]
    );
    const topPengeluaran = allData.reduce((max, curr) =>
      curr.total_pengeluaran > max.total_pengeluaran ? curr : max, allData[0]
    );
    const topProduk = allData.reduce((max, curr) =>
      curr.produk_terjual > max.produk_terjual ? curr : max, allData[0]
    );

    return toko_id ? {
      toko: laporanPerToko[0],
      cabang_terlaris: {
        pemasukan_tertinggi: topPemasukan,
        keuntungan_tertinggi: topKeuntungan,
        pengeluaran_tertinggi: topPengeluaran,
        penjualan_terbanyak: topProduk
      }
    } : {
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
