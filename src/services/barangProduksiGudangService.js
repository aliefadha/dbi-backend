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
    const createdProdukList = [];

    try {
      for (const data of dataArray) {
        // Check if barang_handmade exists
        const barangHandmade = await BarangHandmadeGudang.findOne({
          where: {
            barang_handmade_id: data.barang_handmade_id,
            is_deleted: false
          },
          include: [
            {
              model: RincianBahanGudang,
              as: "rincian_bahan",
              attributes: ["barang_mentah_id", "kuantitas"],
              include: [{
                model: BarangMentah,
                as: "barang_mentah",
                attributes: ["nama_barang"]
              }]
            }
          ],
          transaction
        });

        if (!barangHandmade) {
          throw new Error(`Barang handmade tidak ditemukan`);
        }

        const bahanStockRecords = [];
        for (const bahan of barangHandmade.rincian_bahan) {
          const bahanStockRecord = await StokBarangGudang.findOne({
            where: {
              barang_mentah_id: bahan.barang_mentah_id,
              is_deleted: false
            },
            transaction
          });

          if (!bahanStockRecord || bahanStockRecord.jumlah_stok < (bahan.kuantitas * data.jumlah)) {
            const namaBarangMentah = bahan.barang_mentah ? bahan.barang_mentah.nama_barang : `ID ${bahan.barang_mentah_id}`;
            throw new Error(`Stok untuk '${namaBarangMentah}' tidak mencukupi. Dibutuhkan ${bahan.kuantitas * data.jumlah}, tersedia ${bahanStockRecord ? bahanStockRecord.jumlah_stok : 0}.`);
          }
          bahanStockRecords.push({ record: bahanStockRecord, kuantitas: bahan.kuantitas });
        }
        const createdProduct = await BarangProduksiGudang.create(data, {
          transaction,
        });
        createdProdukList.push(createdProduct);
      }
      return createdProdukList;
    } catch (error) {
      throw new Error(error.message);
    }
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
