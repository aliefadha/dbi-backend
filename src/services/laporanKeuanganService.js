const BarangCustom = require("../models/barangCustom");
const BarangHandmade = require("../models/barangHandmade");
const BarangNonHandmade = require("../models/barangNonHandmade");
const Cabang = require("../models/cabang");
const DeskripsiPemasukan = require("../models/deskripsiPemasukan");
const DeskripsiPengeluaran = require("../models/deskripsiPengeluaran");
const KategoriPemasukan = require("../models/kategoriPemasukan");
const KategoriPengeluaran = require("../models/kategoriPengeluaran");
const LaporanKeuangan = require("../models/laporanKeuangan");  
const MetodePembayaran = require("../models/metodePembayaran");
const Packaging = require("../models/packaging");
const Pemasukan = require("../models/pemasukan");
const Pembelian = require("../models/pembelian");
const Pengeluaran = require("../models/pengeluaran");
const Penjualan = require("../models/penjualan");
const ProdukPembelian = require("../models/produkPembelian");
const ProdukPenjualan = require("../models/produkPenjualan");
const Toko = require("../models/toko");
  
class LaporanKeuanganService {  
  static async create(data) {  
    return await LaporanKeuangan.create(data);  
  }  
  
  static async getAll() {  
    const pengeluaran = await DeskripsiPengeluaran.findAll({
      where: {
        is_deleted: false
      },
      attributes: ['pengeluaran_id', 'deskripsi', 'jumlah_pengeluaran',],
      include: [
        {
          model: Pengeluaran,
          as: 'pengeluaran',
          attributes: ['tanggal'],
          include: [
            {
              model: KategoriPengeluaran,
              as: 'kategori_pengeluaran',
              attributes: ["kategori_pengeluaran"]
            },
          ]
        },
        {
          model: Toko,
          as: 'toko',
          attributes: ["nama_toko"]
        },
        {
          model: Cabang,
          as: 'cabang',
          attributes: ["nama_cabang"]
        },
      ],
      raw: true,
      nest: true
    });

    // Transform the data to flatten the structure
    const transformedPengeluaran = pengeluaran.map(item => ({
      pengeluaran_id: item.pengeluaran_id,
      deskripsi: item.deskripsi,
      jumlah_pengeluaran: item.jumlah_pengeluaran,
      nama_toko: item.toko.nama_toko,
      nama_cabang: item.cabang.nama_cabang,
      kategori_pengeluaran: item.pengeluaran.kategori_pengeluaran.kategori_pengeluaran,
      tanggal: item.pengeluaran.tanggal
    }));
    
    const data = await Pembelian.findAll({
      where: {
        is_deleted: false
      },
      attributes: ['pembelian_id', 'tanggal', 'total_pembelian'],
      include: [
        {
          model: Toko,
          as: "toko",
          attributes: ["nama_toko"]
        },
      ],
      raw: true,
      nest: true
    });  

    const transformedPembelian = await Promise.all(data.map(async (pembelian) => {
      const produk = await ProdukPembelian.findAll({
        where: {
          pembelian_id: pembelian.pembelian_id,
          is_deleted: false
        },
        include: [
          {
            model: BarangHandmade,
            as: 'barang_handmade',
            attributes: ["nama_barang"]
          },
          {
            model: BarangNonHandmade,
            as: 'barang_non_handmade',
            attributes: ["nama_barang"]
          },
          {
            model: BarangCustom,
            as: 'barang_custom',
            attributes: ["nama_barang"]
          },
          {
            model: Packaging,
            as: 'packaging',
            attributes: ["nama_packaging"]
          },
          {
            model: Cabang,
            as: 'cabang',
            attributes: ["nama_cabang"]
          }
        ],
        raw: true,
        nest: true
      });

      return {
        pembelian_id: pembelian.pembelian_id,
        tanggal: pembelian.tanggal,
        total_pengeluaran: pembelian.total_pembelian,
        nama_toko: pembelian.toko.nama_toko,
        produk: produk.map(item => ({
          nama_barang: item.barang_handmade?.nama_barang || 
                      item.barang_non_handmade?.nama_barang || 
                      item.barang_custom?.nama_barang ||
                      item.packaging?.nama_packaging,
          nama_cabang: item.cabang?.nama_cabang
        })),
        kategori_pengeluaran: "Pembelian"
      };
    }));

    const pemasukan = await DeskripsiPemasukan.findAll({
      where: {
        is_deleted: false
      },
      attributes: ['pemasukan_id', 'deskripsi', 'jumlah_pemasukan',],
      include: [
        {
          model: Pemasukan,
          as: 'pemasukan',
          attributes: ['tanggal'],
          include: [
            {
              model: KategoriPemasukan,
              as: 'kategori_pemasukan',
              attributes: ["kategori_pemasukan"]
            },
          ]
        },
        {
          model: Toko,
          as: 'toko',
          attributes: ["nama_toko"]
        },
        {
          model: Cabang,
          as: 'cabang',
          attributes: ["nama_cabang"]
        },
      ],
      raw: true,
      nest: true
    });

    const penjualanData = await Penjualan.findAll({
          where: {
            is_deleted: false
          },
          attributes: ['penjualan_id', 'tanggal', 'total_penjualan'],
          include: [
            {
              model: Toko,
              as: "toko",
              attributes: ["nama_toko"]
            },
          ],
          raw: true,
          nest: true
        });
    
        const transformedPenjualan = await Promise.all(penjualanData.map(async (penjualan) => {
          const produk = await ProdukPenjualan.findAll({
            where: {
              penjualan_id: penjualan.penjualan_id,
              is_deleted: false
            },
            include: [
              {
                model: BarangHandmade,
                as: 'barang_handmade',
                attributes: ["nama_barang"]
              },
              {
                model: BarangNonHandmade,
                as: 'barang_non_handmade',
                attributes: ["nama_barang"]
              },
              {
                model: BarangCustom,
                as: 'barang_custom',
                attributes: ["nama_barang"]
              },
              {
                model: Packaging,
                as: 'packaging',
                attributes: ["nama_packaging"]
              },
              {
                model: Cabang,
                as: 'cabang',
                attributes: ["nama_cabang"]
              }
            ],
            raw: true,
            nest: true
          });
    
          return {
            penjualan_id: penjualan.penjualan_id,
            tanggal: penjualan.tanggal,
            total_pengeluaran: penjualan.total_penjualan,
            nama_toko: penjualan.toko.nama_toko,
            produk: produk.map(item => ({
              nama_barang: item.barang_handmade?.nama_barang || 
                          item.barang_non_handmade?.nama_barang || 
                          item.barang_custom?.nama_barang ||
                          item.packaging?.nama_packaging,
              nama_cabang: item.cabang?.nama_cabang
            })),
            kategori_pemasukan: "Penjualan"
          };
        }));

        const totalPemasukan = [
          ...pemasukan.map(item => item.jumlah_pemasukan),
          ...transformedPenjualan.map(item => item.total_pengeluaran)
        ].reduce((total, amount) => total + amount, 0);

        const totalPengeluaran = [
          ...pengeluaran.map(item => item.jumlah_pengeluaran),
          ...transformedPembelian.map(item => item.total_pengeluaran)
        ].reduce((total, amount) => total + amount, 0);

        const laporan = {
          pengeluaran: [...transformedPengeluaran,...transformedPembelian],
          pemasukan: [...pemasukan, ...transformedPenjualan],
          total_pemasukan: totalPemasukan,
          total_pengeluaran: totalPengeluaran,
          keuntungan: totalPemasukan - totalPengeluaran,
          produk_terjual: transformedPenjualan.reduce((total, item) => total + item.produk.length, 0),
        }
    return laporan;
  }
  
  static async getById(id) {  
    return await LaporanKeuangan.findOne({
      where: {
        laporan_keuangan_id: id,
        is_deleted: false
      }
    });  
  }  
  
  static async update(id, data) {  
    const laporanKeuangan = await LaporanKeuangan.findByPk(id);  
    if (!laporanKeuangan) return null;  
  
    Object.assign(laporanKeuangan, data);  
    await laporanKeuangan.save();  
  
    return laporanKeuangan;  
  }  
  
  static async delete(id) {  
    const laporanKeuangan = await LaporanKeuangan.findByPk(id);  
    if (!laporanKeuangan) return null;  
    await laporanKeuangan.update({ is_deleted: true });  
    return true;  
  }  
}  
  
module.exports = LaporanKeuanganService;
