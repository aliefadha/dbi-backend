const { Op } = require("sequelize");
const BarangHandmadeGudang = require("../models/barangHandmadeGudang");
const BarangMentah = require("../models/barangMentah");
const BarangNonHandmadeGudang = require("../models/barangNonHandmadeGudang");
const BarangProduksiGudang = require("../models/barangProduksiGudang");
const RincianBahanGudang = require("../models/rincianBahanGudang");
const StokBarangGudang = require("../models/stokBarangGudang");

class BarangProduksiGudangService {
  static async create(data) {
    const res = await BarangProduksiGudang.create(data);
    // adjusting the absensi
    // let barang = await StokBarangGudang.findOne({
    //   where: {
    //     barang_id: res.barang_id,
    //     is_deleted: false
    //   }
    // })

    // if(barang){
    //   await barang.update({jumlah_stok: barang.jumlah_stok + res.jumlah})
    //   await barang.save()
    // } else {
    //   await StokBarangGudang.create({barang_id: res.barang_id, jumlah_stok: res.jumlah})
    // }
    return res
  }

  static async getAll() {
    return await BarangProduksiGudang.findAll({
      where: {
        is_deleted: false
      },
      include: [
        {
          model: BarangNonHandmadeGudang,
          as: "barang",
          attributes: ["nama_barang"]
        }
      ]
    });
  }

  static async getById(id) {
    return await BarangProduksiGudang.findOne({
      where: {
        barang_produksi_gudang_id: id,
        is_deleted: false
      },
      include: [
        {
          model: BarangNonHandmadeGudang,
          as: "barang",
          attributes: ["nama_barang"]
        }
      ]
    });
  }

  static async update(id, data) {
    const barangProduksiGudang = await BarangProduksiGudang.findByPk(id);
    if (!barangProduksiGudang) return null;

    Object.assign(barangProduksiGudang, data);
    await barangProduksiGudang.save();

    return barangProduksiGudang;
  }

  static async delete(id) {
    const barangProduksiGudang = await BarangProduksiGudang.findByPk(id);
    if (!barangProduksiGudang) return null;
    await barangProduksiGudang.update({ is_deleted: true });
    return true;
  }

 static async createMany(dataArray, options = {}) {
    const transaction = options.transaction;

    try {
      // Tahap 1: Agregasi (Penjumlahan) Total Kebutuhan Bahan Baku
      const totalBahanDibutuhkan = new Map();
      for (const data of dataArray) {
        const barangHandmade = await BarangHandmadeGudang.findOne({
          where: { barang_handmade_id: data.barang_handmade_id, is_deleted: false },
          include: [{ model: RincianBahanGudang, as: "rincian_bahan" }],
          transaction
        });

        if (!barangHandmade) {
          throw new Error(`Barang handmade dengan ID ${data.barang_handmade_id} tidak ditemukan.`);
        }

        for (const bahan of barangHandmade.rincian_bahan) {
          const kuantitasDiperlukan = bahan.kuantitas * data.jumlah;
          const totalSaatIni = totalBahanDibutuhkan.get(bahan.barang_mentah_id) || 0;
          totalBahanDibutuhkan.set(bahan.barang_mentah_id, totalSaatIni + kuantitasDiperlukan);
        }
      }

      // Tahap 2: Validasi Stok Secara Massal
      const semuaBahanIds = Array.from(totalBahanDibutuhkan.keys());
      if (semuaBahanIds.length === 0) {
        // Jika tidak ada bahan yang dibutuhkan, langsung proses
        return await this.createRecords(dataArray, transaction);
      }

      const stokTersediaRecords = await StokBarangGudang.findAll({
        where: {
          barang_mentah_id: { [Op.in]: semuaBahanIds },
          is_deleted: false
        },
        include: [{ model: BarangMentah, as: 'barang_mentah', attributes: ['nama_barang'] }],
        transaction
      });

      const stokTersediaMap = new Map(
        stokTersediaRecords.map(stok => [stok.barang_mentah_id, stok])
      );
      
      const stockErrors = [];
      for (const [barangMentahId, kuantitasDibutuhkan] of totalBahanDibutuhkan.entries()) {
        const stokRecord = stokTersediaMap.get(barangMentahId);

        if (!stokRecord || stokRecord.jumlah_stok < kuantitasDibutuhkan) {
          const namaBarang = stokRecord?.barang_mentah?.nama_barang || `ID ${barangMentahId}`;
          const stokTersedia = stokRecord ? stokRecord.jumlah_stok : 0;
          stockErrors.push(`'${namaBarang}' (butuh ${kuantitasDibutuhkan}, tersedia ${stokTersedia})`);
        }
      }

      if (stockErrors.length > 0) {
        throw new Error(`Stok tidak mencukupi untuk bahan berikut: ${stockErrors.join(', ')}.`);
      }

      // Tahap 3: Jika Stok Cukup, Buat Semua Catatan Produksi
      return await this.createRecords(dataArray, transaction);

    } catch (error) {
      throw error;
    }
  }

  static async createRecords(dataArray, transaction) {
    const createdProdukList = [];
    for (const data of dataArray) {
      const createdProduct = await BarangProduksiGudang.create(data, { transaction });
      createdProdukList.push(createdProduct);
    }
    return createdProdukList;
  }

  static async deleteByProduksi(id, options = {}) {
    return await BarangProduksiGudang.update(
      { is_deleted: true },
      {
        where: {
          produksi_gudang_id: id
        },
        ...options
      }
    );
  }
}

module.exports = BarangProduksiGudangService;
