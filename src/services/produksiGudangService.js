const { sequelize } = require("../models");
const BarangHandmadeGudang = require("../models/barangHandmadeGudang");
const BarangProduksiGudang = require("../models/barangProduksiGudang");
const ProduksiGudang = require("../models/produksiGudang");
const RincianBahanGudang = require("../models/rincianBahanGudang");
const StokBarangGudang = require("../models/stokBarangGudang");
const BarangProduksiGudangService = require("./barangProduksiGudangService");

class ProduksiGudangService {
  static async create(data) {
    const transaction = await sequelize.transaction();
    try {
      const { jumlah_produksi, total_menit, image, tanggal, karyawan_id, produk } = data;

      const produksi = await ProduksiGudang.create({
        jumlah_produksi,
        total_menit,
        image,
        tanggal,
        karyawan_id
      }, { transaction });

      if (produk && produk.length > 0) {
        const produkData = produk.map(item => ({
          ...item,
          produksi_gudang_id: produksi.produksi_gudang_id
        }));

        await BarangProduksiGudangService.createMany(produkData, { transaction }, false);
      }

      await transaction.commit();
      return produksi;
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  static async getAll() {
    return await ProduksiGudang.findAll({
      where: {
        is_deleted: false
      },
      include: [
        {
          model: BarangProduksiGudang,
          as: "produk",
          attributes: ["jumlah"],
          include: [
            {
              model: BarangHandmadeGudang,
              as: "barang",
              where: {
                is_deleted: false
              },
              attributes: ["barang_handmade_id", "nama_barang"]
            }
          ]
        }
      ]
    });
  }

  static async getById(id) {
    return await ProduksiGudang.findOne({
      where: {
        produksi_gudang_id: id,
        is_deleted: false
      },
      include: [
        {
          model: BarangProduksiGudang,
          as: "produk",
          attributes: ["jumlah"],
          include: [
            {
              model: BarangHandmadeGudang,
              as: "barang",
              where: {
                is_deleted: false
              },
              attributes: ["barang_handmade_id", "nama_barang"]
            }
          ]
        }
      ]
    });
  }

  static async getByKaryawanId(karyawan_id) {
    return await ProduksiGudang.findAll({
      where: {
        karyawan_id: karyawan_id,
        is_deleted: false
      },
      include: [
        {
          model: BarangProduksiGudang,
          as: "produk",
          attributes: ["jumlah"],
          include: [
            {
              model: BarangHandmadeGudang,
              as: "barang",
              where: {
                is_deleted: false
              },
              attributes: ["barang_handmade_id", "nama_barang"]
            }
          ]
        }
      ]
    });
  }

  static async update(id, data) {
    const transaction = await sequelize.transaction();
    try {
      const { jumlah_produksi, total_menit, image, tanggal, karyawan_id, status } = data;

      const produksiGudang = await ProduksiGudang.findOne({
        where: {
          produksi_gudang_id: id,
          is_deleted: false
        },
        include: [
          {
            model: BarangProduksiGudang,
            as: "produk",
            attributes: ["jumlah"],
            include: [
              {
                model: BarangHandmadeGudang,
                as: "barang",
                attributes: ["barang_handmade_id"],
                include: [
                  {
                    model: RincianBahanGudang,
                    as: "rincian_bahan",
                    attributes: ["barang_mentah_id", "kuantitas"],
                  }
                ]
              }
            ]
          }
        ],
        transaction
      });
      if (!produksiGudang) return null;

      await produksiGudang.update({
        jumlah_produksi,
        total_menit,
        image,
        tanggal,
        status,
        karyawan_id
      }, { transaction });

      const bahanProduction = produksiGudang.produk.flatMap(item =>
        item.barang.rincian_bahan
      );


      if (status === "terima") {
        for (const bahan of bahanProduction) {
          const stockRecord = await StokBarangGudang.findOne({
            where: {
              barang_mentah_id: bahan.barang_mentah_id,
              is_deleted: false
            },
            transaction
          });
          if (!stockRecord) {
            throw new Error(`Stok tidak ditemukan`);
          }
          await stockRecord.decrement('jumlah_stok', {
            by: (bahan.kuantitas * produksiGudang.jumlah_produksi),
            transaction
          });
        }
      }

      await transaction.commit();
      return produksiGudang.produk;
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  static async delete(id) {
    const produksiGudang = await ProduksiGudang.findByPk(id);
    if (!produksiGudang) return null;
    await produksiGudang.update({ is_deleted: true });
    return true;
  }
}

module.exports = ProduksiGudangService;
