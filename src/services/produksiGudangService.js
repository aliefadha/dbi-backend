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
            },
            
          ]
        },
        {
          model: Karyawan,
          as: "karyawan",
          attributes: ["karyawan_id", "nama_karyawan"]
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

      const statusSebelumnya = produksiGudang.status;

      await produksiGudang.update({
        jumlah_produksi,
        total_menit,
        image,
        tanggal,
        status,
        karyawan_id
      }, { transaction });


      if (status === "diterima" && statusSebelumnya !== "diterima") {
        
        // Iterasi setiap jenis barang yang diproduksi dalam sesi ini
        for (const produkItem of produksiGudang.produk) {
          const jumlahDihasilkan = produkItem.jumlah;
          const barangHandmade = produkItem.barang;

          // 1. Kurangi stok bahan mentah yang digunakan
          for (const rincianBahan of barangHandmade.rincian_bahan) {
            const stokBahanMentah = await StokBarangGudang.findOne({
              where: {
                barang_mentah_id: rincianBahan.barang_mentah_id,
                is_deleted: false
              },
              transaction
            });

            if (!stokBahanMentah) {
              throw new Error(`Stok untuk bahan mentah (ID: ${rincianBahan.barang_mentah_id}) tidak ditemukan.`);
            }

            // Kurangi stok sesuai resep x jumlah yang dihasilkan
            await stokBahanMentah.decrement('jumlah_stok', {
              by: rincianBahan.kuantitas * jumlahDihasilkan,
              transaction
            });
          }

          // 2. Tambah stok barang jadi (handmade) yang dihasilkan
          const [stokBarangJadi, isCreated] = await StokBarangGudang.findOrCreate({
              where: { barang_handmade_id: barangHandmade.barang_handmade_id },
              defaults: {
                  barang_handmade_id: barangHandmade.barang_handmade_id,
                  jumlah_stok: 0, 
                  is_deleted: false
              },
              transaction
          });

          await stokBarangJadi.increment('jumlah_stok', {
            by: jumlahDihasilkan,
            transaction
          });
        }

        // Proses data karyawan (absensi dan gaji)
        const karyawanData = await Karyawan.findOne({
          where: { 
            karyawan_id: produksiGudang.karyawan_id,
          },
          transaction
        });

        if (!karyawanData) {  
          throw new Error("Karyawan tidak ditemukan");  
        } 
        
        const tanggalAbsen = new Date(tanggal);
        const gajiPokokPermenit = karyawanData.jumlah_gaji_pokok / karyawanData.waktu_kerja_sebulan_menit;
        let gajiPokokPerhari = gajiPokokPermenit * produksiGudang.total_menit;

        if (tanggalAbsen.getDay() === 6) { 
            gajiPokokPerhari -= 60 * gajiPokokPermenit;
        }

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
      return produksiGudang;
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
