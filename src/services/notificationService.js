const BarangCustom = require("../models/barangCustom");
const BarangHandmade = require("../models/barangHandmade");
const BarangHandmadeGudang = require("../models/barangHandmadeGudang");
const BarangMentah = require("../models/barangMentah");
const BarangNonHandmade = require("../models/barangNonHandmade");
const BarangNonHandmadeGudang = require("../models/barangNonHandmadeGudang");
const Packaging = require("../models/packaging");
const PackagingGudang = require("../models/packagingGudang");
const StokBarang = require("../models/stokBarang");
const StokBarangGudang = require("../models/stokBarangGudang");
  
class NotificationService {  
  static async notifStok(toko_id, cabang) {  
    const whereConditions = {
      is_deleted: false
    }
    if (toko_id) {
      whereConditions.toko_id = toko_id
    }
    if (cabang) {
      whereConditions.cabang_id = cabang
    }
    const stokBarang = await StokBarang.findAll({
      where: whereConditions,
      include: [
        {
          model: BarangHandmade,
          as: "barang_handmade",
          attributes: ["barang_handmade_id", "nama_barang","jumlah_minimum_stok"]
        },
        {
          model: BarangNonHandmade,
          as: "barang_non_handmade",
          attributes: ["barang_non_handmade_id", "nama_barang","jumlah_minimum_stok"]
        },
        {
          model: BarangCustom,
          as: "barang_custom",
          attributes: ["barang_custom_id", "nama_barang","jumlah_minimum_stok"]
        },
        {
          model: Packaging,
          as: "packaging",
          attributes: ["packaging_id", "nama_packaging","jumlah_minimum_stok"]
        }
      ]
    });

    const notifications = [];

    stokBarang.forEach(item => {
      // Ambil model yang sesuai dengan stok_barang
      let model = item.barang_handmade || item.barang_non_handmade || item.barang_custom || item.packaging;
      if (!model) {
        return; // Skip jika model tidak ditemukan
      }
      // Periksa apakah stok kurang dari atau sama dengan jumlah minimum stok
      if (item.dataValues.jumlah_stok <= model.jumlah_minimum_stok) {
        // Buat pesan notifikasi
        let message = `Stok ${model.nama_barang || model.nama_packaging} ${model.barang_handmade_id || model.barang_nonhandmade_id || model.barang_custom_id || model.packaging_id} telah mencapai batas minimum sebesar ${item.dataValues.jumlah_stok}`;
        notifications.push({
          message: message,
        });
      }
    });

    return notifications
    
  }

  static async notifStokGudang() {
    const stokBarang = await StokBarangGudang.findAll({
      include: [
        {
          model: BarangNonHandmadeGudang,
          as: "barang_nonhandmade",
          attributes: ["barang_nonhandmade_id", "nama_barang", "jumlah_minimum_stok"],
        },
        {
          model: BarangHandmadeGudang,
          as: "barang_handmade",
          attributes: ["barang_handmade_id", "nama_barang", "jumlah_minimum_stok"],
        },
        {
          model: BarangMentah,
          as: "barang_mentah",
          attributes: ["barang_mentah_id", "nama_barang", "jumlah_minimum_stok"],
        },
        {
          model: PackagingGudang,
          as: "packaging",
          attributes: ["packaging_id", "nama_packaging", "jumlah_minimum_stok"],
        },
      ],
    })

    const notifications = [];

    stokBarang.forEach(item => {
      // Ambil model yang sesuai dengan stok_barang
      let model = item.barang_nonhandmade || item.barang_handmade || item.barang_mentah || item.packaging;
      if (!model) {
        return; // Skip jika model tidak ditemukan
      }
      // Periksa apakah stok kurang dari atau sama dengan jumlah minimum stok
      if (item.dataValues.jumlah_stok <= model.jumlah_minimum_stok) {
        // Buat pesan notifikasi
        let message = `Stok ${model.nama_barang || model.nama_packaging} ${model.barang_nonhandmade_id || model.barang_handmade_id || model.barang_mentah_id || model.packaging_id} telah mencapai batas minimum sebesar ${item.dataValues.jumlah_stok}`;
        notifications.push({
          message: message,
        });
      }
    });

    return notifications;
  }
}  
  
module.exports = NotificationService;  
