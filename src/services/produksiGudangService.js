const { Op } = require("sequelize");
const { sequelize } = require("../models");
const AbsensiKaryawan = require("../models/absensiKaryawan");
const BarangHandmadeGudang = require("../models/barangHandmadeGudang");
const BarangProduksiGudang = require("../models/barangProduksiGudang");
const Karyawan = require("../models/karyawan");
const ProduksiGudang = require("../models/produksiGudang");
const RincianBahanGudang = require("../models/rincianBahanGudang");
const StokBarangGudang = require("../models/stokBarangGudang");
const BarangProduksiGudangService = require("./barangProduksiGudangService");

class ProduksiGudangService {
  static async create(data) {
    const transaction = await sequelize.transaction();
    try {
      const { jumlah_produksi, total_menit, image, tanggal, karyawan_id, produk, lng, lat } = data;

      const produksi = await ProduksiGudang.create({
        jumlah_produksi,
        total_menit,
        image,
        tanggal,
        karyawan_id,
        lng,
        lat,
        gmaps: `https://www.google.com/maps/place/?q=${lat},${lng}`
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

  static async getAll(startDate, endDate) {
    
    const whereClause = {
      is_deleted: false
    };

    if (startDate && endDate) {
      whereClause.tanggal = {
        [Op.between]: [startDate, endDate]
      };
    }

    return await ProduksiGudang.findAll({
      where: whereClause,
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
        // Process stock updates
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

        // Process karyawan data
        const karyawanData = await Karyawan.findOne({
          where: { 
            karyawan_id: produksiGudang.karyawan_id,
          },
          transaction
        });

        if (!karyawanData) {  
          throw new Error("Karyawan not found");  
        } 

        let gajiPokokPerhari = (karyawanData.jumlah_gaji_pokok / karyawanData.waktu_kerja_sebulan_menit) * produksiGudang.total_menit; 

        // Create absensi record
        await AbsensiKaryawan.create({
          image: produksiGudang.image,
          karyawan_id: produksiGudang.karyawan_id,
          tanggal: produksiGudang.tanggal,
          total_menit: produksiGudang.total_menit,
          status: status,
          gaji_pokok_perhari: gajiPokokPerhari,
          lng: produksiGudang.lng,
          lat: produksiGudang.lat,
          gmaps: produksiGudang.gmaps
        }, { transaction });

        await produksiGudang.update({
          gaji_pokok_perhari: gajiPokokPerhari,
        }, { transaction });
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
