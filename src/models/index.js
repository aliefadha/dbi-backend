// relation files

// models/relation.js  
const sequelize = require('../config/database');
const DivisiKaryawan = require('./divisiKaryawan');
const JenisBarang = require('./jenisBarang');
const Karyawan = require('./karyawan');
const KategoriBarang = require('./kategoriBarang');
const Kpi = require('./kpi');
const Packaging = require('./packaging');
const Cabang = require('./cabang');
const TargetBulananKasir = require('./targetBulananKasir');
const CutiKaryawan = require('./cutiKaryawan');
const AbsensiKaryawan = require('./absensiKaryawan');
const BarangCustom = require("./barangCustom");
const KpiKaryawan = require("./kpiKaryawan");
const MetodePembayaran = require('./metodePembayaran');
const JenisBarangGudang = require('./jenisBarangGudang');
const BarangNonHandmadeGudang = require('./barangNonHandmadeGudang');
const KategoriBarangGudang = require('./kategoriBarangGudang');
const RincianBiayaGudang = require('./rincianBiayaGudang');
const RincianBahanGudang = require('./rincianBahanGudang');
const BarangMentah = require('./barangMentah');
const PembelianGudang = require('./pembelianGudang');
const MetodePembayaranGudang = require('./metodePembayaranGudang');
const ProdukPembelianGudang = require('./produkPembelianGudang');
const PenjualanGudang = require('./penjualanGudang');
const ProdukPenjualanGudang = require('./produkPenjualanGudang');
const PackagingGudang = require('./packagingGudang');
const StokBarangGudang = require('./stokBarangGudang');
const BarangProduksiGudang = require('./barangProduksiGudang');
const BiayaToko = require('./biayaToko');
const BiayaOperasional = require('./biayaOperasional');
const BiayaStaff = require('./biayaStaff');
const BarangHandmade = require('./barangHandmade');
const BarangNonHandmade = require('./barangNonHandmade');
const RincianBiaya = require('./rincianBiaya');
const DetailRincianBiaya = require('./detailRincianBiaya');
const BiayaOperasionalProduksiGudang = require('./biayaOperasionalProduksiGudang');
const OperasionalProduksiGudang = require('./operasionalProduksiGudang');
const BiayaOperasionalStaffGudang = require('./biayaOperasionalStaffGudang');
const OperasionalStaffGudang = require('./operasionalStaffGudang');
const BarangHandmadeGudang = require('./barangHandmadeGudang');
const BiayaGudang = require('./biayaGudang');
const Pembelian = require('./pembelian');
const ProdukPembelian = require('./produkPembelian');

const ProduksiGudang = require('./produksiGudang');
const StokBarang = require('./stokBarang');
const Penjualan = require('./penjualan');
const ProdukPenjualan = require('./produkPenjualan');



JenisBarang.hasMany(BarangNonHandmade, {
    foreignKey: 'jenis_barang_id',
    as: "barangNonHandmade",
});

JenisBarang.hasMany(BarangCustom, {
    foreignKey: 'jenis_barang_id',
    as: "barangCustom"
})

JenisBarang.hasMany(Packaging, {
    foreignKey: 'jenis_barang_id',
    as: "packaging"
})

Packaging.belongsTo(JenisBarang, {
    foreignKey: 'jenis_barang_id',
    as: "jenis_barang"
})

JenisBarangGudang.hasMany(BarangNonHandmadeGudang, {
    foreignKey: 'jenis_barang_id',
    as: "barang_nonhandmade", 
})

JenisBarangGudang.hasMany(BarangHandmadeGudang, {
    foreignKey: 'jenis_barang_id',
    as: "barang_handmade", 
})

KategoriBarang.hasMany(BarangNonHandmade, {
    foreignKey: 'kategori_barang_id',
    as: "barang",
});

KategoriBarang.hasMany(Packaging, {
    foreignKey: 'kategori_barang_id',
    as: "packaging"
})

Packaging.belongsTo(KategoriBarang, {
    foreignKey: 'kategori_barang_id',
    as: "kategori_barang"
})

KategoriBarangGudang.hasMany(BarangNonHandmadeGudang, {
    foreignKey: 'kategori_barang_id',
    as: "barang_nonhandmade",
});

KategoriBarangGudang.hasMany(BarangHandmadeGudang, {
    foreignKey: 'kategori_barang_id',
    as: "barang_handmade",
});

BarangNonHandmade.belongsTo(KategoriBarang, {
    foreignKey: 'kategori_barang_id',
    as: "kategori",
})

BarangNonHandmade.belongsTo(JenisBarang, {
    foreignKey: "jenis_barang_id",
    as: "jenis",
})


BarangNonHandmadeGudang.belongsTo(KategoriBarangGudang, {
    foreignKey: 'kategori_barang_id',
    as: "kategori",
})

BarangHandmadeGudang.belongsTo(KategoriBarangGudang, {
    foreignKey: 'kategori_barang_id',
    as: "kategori",
})

BarangNonHandmadeGudang.belongsTo(JenisBarangGudang, {
    foreignKey: "jenis_barang_id",
    as: "jenis",
})

BarangHandmadeGudang.belongsTo(JenisBarangGudang, {
    foreignKey: "jenis_barang_id",
    as: "jenis",
})

BarangNonHandmadeGudang.hasMany(RincianBiayaGudang, {
    foreignKey: "barang_nonhandmade_id",
    as: "rincian_biaya"
})

RincianBiayaGudang.belongsTo(BarangNonHandmadeGudang ,{
    foreignKey: "barang_nonhandmade_id",
    as: "barang_nonhandmade"
})



BarangHandmadeGudang.hasMany(RincianBiayaGudang, {
    foreignKey: "barang_handmade_id",
    as: "rincian_biaya",
})

RincianBiayaGudang.belongsTo(BarangHandmadeGudang ,{
    foreignKey: "barang_handmade_id",
    as: "barang_handmade"
})

BarangHandmadeGudang.hasMany(RincianBahanGudang, {
    foreignKey: "barang_handmade_id",
    as: "rincian_bahan",
})

RincianBahanGudang.belongsTo(BarangHandmadeGudang, {
    foreignKey: "barang_handmade_id",
    as: "barang_handmade",
})

BarangMentah.hasMany(RincianBahanGudang, {
    foreignKey: "barang_mentah_id",
    as: "rincian_bahan"
})

BarangMentah.hasMany(ProdukPembelianGudang, {
    foreignKey: "barang_mentah_id",
    as: "produk_pembelian"
})

BarangMentah.hasMany(ProdukPenjualanGudang, {
    foreignKey: "barang_mentah_id",
    as: "produk_penjualan"
})

RincianBahanGudang.belongsTo(BarangMentah, {
    foreignKey: "barang_mentah_id",
    as: 'barang_mentah'
})

PembelianGudang.belongsTo(MetodePembayaranGudang, {
    foreignKey: "metode_id",
    as: "metode_pembelian"
})

PembelianGudang.hasMany(ProdukPembelianGudang, {
    foreignKey: "pembelian_id",
    as: "produk"
})

ProdukPembelianGudang.belongsTo(PembelianGudang, {
    foreignKey: "pembelian_id",
    as: "pembelian"
})

PenjualanGudang.hasMany(ProdukPenjualanGudang, {
    foreignKey: "penjualan_id",
    as: "produk"
})

ProdukPenjualanGudang.belongsTo(PenjualanGudang, {
    foreignKey: "penjualan_id",
    as: "penjualan"
})

ProdukPembelianGudang.belongsTo(BarangNonHandmadeGudang, {
    foreignKey: "barang_nonhandmade_id",
    as: "barang_nonhandmade"
})

ProdukPembelianGudang.belongsTo(BarangHandmadeGudang, {
    foreignKey: "barang_handmade_id",
    as: "barang_handmade"
})

ProdukPembelianGudang.belongsTo(BarangMentah, {
    foreignKey: "barang_mentah_id",
    as: "barang_mentah"
})

ProdukPembelianGudang.belongsTo(PackagingGudang, {
    foreignKey: "packaging_id",
    as: "packaging"
})

MetodePembayaranGudang.hasMany(PembelianGudang, {
    foreignKey: "metode_id",
    as: "metode_pembelian"
})

MetodePembayaranGudang.hasMany(PenjualanGudang, {
    foreignKey: "metode_id",
    as: "metode_pembayaran"
})

PenjualanGudang.belongsTo(MetodePembayaranGudang, {
    foreignKey: "metode_id",
    as: "metode_pembayaran"
})

ProdukPenjualanGudang.belongsTo(BarangNonHandmadeGudang, {
    foreignKey: "barang_nonhandmade_id",
    as: "barang_nonhandmade"
})

ProdukPenjualanGudang.belongsTo(BarangHandmadeGudang, {
    foreignKey: "barang_handmade_id",
    as: "barang_handmade"
})

ProdukPenjualanGudang.belongsTo(BarangMentah, {
    foreignKey: "barang_mentah_id",
    as: "barang_mentah"
})

ProdukPenjualanGudang.belongsTo(PackagingGudang, {
    foreignKey: "packaging_id",
    as: "packaging",
})


PackagingGudang.hasMany(ProdukPenjualanGudang, {
    foreignKey: "packaging_id",
    as: "produk_penjualan"
})

PackagingGudang.hasMany(ProdukPembelianGudang, {
    foreignKey: "packaging_id",
    as: "produk_pembelian"
})

PackagingGudang.hasOne(StokBarangGudang, {
    foreignKey: "packaging_id",
    as: "stok_barang"
})

StokBarangGudang.belongsTo(PackagingGudang, {
    foreignKey: "packaging_id",
    as: "packaging"
})

BarangNonHandmadeGudang.hasOne(StokBarangGudang, {
    foreignKey: "barang_nonhandmade_id",
    as: "stok_barang"
})

StokBarangGudang.belongsTo(BarangNonHandmadeGudang, {
    foreignKey: "barang_nonhandmade_id",
    as: "barang_nonhandmade"
})

StokBarangGudang.belongsTo(BarangHandmadeGudang, {
    foreignKey: "barang_handmade_id",
    as: "barang_handmade"
})

BarangHandmadeGudang.hasOne(StokBarangGudang, {
    foreignKey: "barang_handmade_id",
    as: "stok_barang"
})

StokBarangGudang.belongsTo(BarangMentah, {
    foreignKey: "barang_mentah_id",
    as: "barang_mentah"
})

BarangMentah.hasOne(StokBarangGudang, {
    foreignKey: "barang_mentah_id",
    as: "stok_barang"
})

BiayaOperasionalProduksiGudang.belongsTo(BiayaGudang, {
    foreignKey: "biaya_gudang_id",
    as: 'biaya_gudang'
})

BiayaGudang.hasMany(BiayaOperasionalProduksiGudang, {
    foreignKey: "biaya_gudang_id",
    as: "biaya_operasional"
})

BiayaOperasionalStaffGudang.belongsTo(BiayaGudang, {
    foreignKey: "biaya_gudang_id",
    as: 'biaya_gudang'
})

BiayaGudang.hasMany(BiayaOperasionalStaffGudang, {
    foreignKey: "biaya_gudang_id",
    as: "biaya_staff"
})

BarangNonHandmadeGudang.hasMany(BarangProduksiGudang, {
    foreignKey: "barang_id",
    as: "barang_produksi"
})

KategoriBarang.hasMany(BarangCustom, {
    foreignKey: 'kategori_barang_id',
    as: "barang_custom"
})

BarangCustom.belongsTo(KategoriBarang, {
    foreignKey: 'kategori_barang_id',
    as: "kategori",
})

JenisBarang.hasMany(BarangCustom, {
    foreignKey: 'jenis_barang_id',
    as: "barang_custom"
})

BarangCustom.belongsTo(JenisBarang, {
    foreignKey: 'jenis_barang_id',
    as: "jenis_barang"
})


MetodePembayaran.hasMany(Penjualan, {
    foreignKey: "metode_id",
    as: 'penjualan'
});

Penjualan.belongsTo(MetodePembayaran, {
    foreignKey: "metode_id",
    as: "metode_pembayaran"
})

MetodePembayaran.hasMany(Pembelian, {
    foreignKey: "metode_id",
    as: "pembelian"
})

ProduksiGudang.hasMany(BarangProduksiGudang, {
    foreignKey: "produksi_gudang_id",
    as: "produk"
})

BarangProduksiGudang.belongsTo(ProduksiGudang, {
    foreignKey: "produksi_gudang_id",
    as: "produksi"
})

BarangProduksiGudang.belongsTo(BarangHandmadeGudang, {
    foreignKey: "barang_handmade_id",
    as: "barang"
})

BarangHandmadeGudang.hasMany(BarangProduksiGudang, {
    foreignKey: "barang_handmade_id",
    as: "barang_produksi"
})

Pembelian.belongsTo(MetodePembayaran, {
    foreignKey: "metode_pembayaran_id",
    as: "metode_pembayaran"
})

DivisiKaryawan.hasMany(Karyawan, {
    foreignKey: "divisi_karyawan_id",
    as: "karyawan",
})

Karyawan.belongsTo(DivisiKaryawan, {
    foreignKey: "divisi_karyawan_id",
    as: "divisi"
})

DivisiKaryawan.hasMany(Kpi, {
    foreignKey: "divisi_karyawan_id",
    as: "kpi",
})

Kpi.belongsTo(DivisiKaryawan, {
    foreignKey: "divisi_karyawan_id",
    as: "divisi"
})

Cabang.hasMany(TargetBulananKasir, {
    foreignKey: "cabang_id",
    as: "target_bulanan_kasir",
})

TargetBulananKasir.belongsTo(Cabang, {
    foreignKey: "cabang_id",
    as: "cabang",
})

Karyawan.hasMany(CutiKaryawan, {
    foreignKey: "karyawan_id",
    as: "cuti_karyawan",
})

CutiKaryawan.belongsTo(Karyawan, {
    foreignKey: "karyawan_id",
    as: "karyawan",
})

Karyawan.hasMany(AbsensiKaryawan, {
    foreignKey: "karyawan_id",
    as: "absensi_karyawan",
})

AbsensiKaryawan.belongsTo(Karyawan, {
    foreignKey: "karyawan_id",
    as: "karyawan",
})

Cabang.hasMany(Karyawan, {
    foreignKey: "cabang_id",
    as: "karyawan",
})

Cabang.hasMany(Karyawan, {
    foreignKey: "cabang_id_first",
    as: "karyawan_first",
})

Karyawan.belongsTo(Cabang, {
    foreignKey: "cabang_id",
    as: "cabang",
})

Karyawan.belongsTo(Cabang, {
    foreignKey: "cabang_id_first",
    as: "cabang_first",
})

Karyawan.hasMany(KpiKaryawan, {
    foreignKey: "karyawan_id",
    as: "kpi_karyawan",
})

KpiKaryawan.belongsTo(Karyawan, {
    foreignKey: "karyawan_id",
    as: "karyawan",
})

Kpi.hasMany(KpiKaryawan, {
    foreignKey: "kpi_id",
    as: "kpi_karyawan",
})

KpiKaryawan.belongsTo(Kpi, {
    foreignKey: "kpi_id",    
    as: "kpi",
})

Cabang.hasOne(BiayaToko, {
    foreignKey: "cabang_id",
    as: "biaya_toko",
})

BiayaToko.belongsTo(Cabang, {
    foreignKey: "cabang_id",
    as: "cabang",
})

BiayaToko.hasMany(BiayaOperasional, {
    foreignKey: "biaya_toko_id",
    as: "biaya_operasional",
})

BiayaOperasional.belongsTo(BiayaToko, {
    foreignKey: "biaya_toko_id",
    as: "biaya_toko",
})

BiayaToko.hasMany(BiayaStaff, {
    foreignKey: "biaya_toko_id",
    as: "biaya_staff",
})

BiayaStaff.belongsTo(BiayaToko, {
    foreignKey: "biaya_toko_id",
    as: "biaya_toko",
})

JenisBarang.hasMany(BarangHandmade, {
    foreignKey: "jenis_barang_id",
    as: "barang_handmade",
})

BarangHandmade.belongsTo(JenisBarang, { 
    foreignKey: "jenis_barang_id",
    as: "jenis_barang",
})

KategoriBarang.hasMany(BarangHandmade, {
    foreignKey: "kategori_barang_id",
    as: "barang_handmade",
})

BarangHandmade.belongsTo(KategoriBarang, { 
    foreignKey: "kategori_barang_id",
    as: "kategori_barang",
})

BarangHandmade.hasMany(RincianBiaya, {
    foreignKey: "barang_handmade_id",
    as: "rincian_biaya",
})

RincianBiaya.belongsTo(BarangHandmade, {
    foreignKey: "barang_handmade_id",
    as: "barang_handmade",
})

RincianBiaya.hasMany(DetailRincianBiaya, {
    foreignKey: "rincian_biaya_id",
    as: "detail_rincian_biaya",
})

DetailRincianBiaya.belongsTo(RincianBiaya, {
    foreignKey: "rincian_biaya_id",
    as: "rincian_biaya",
})

BiayaToko.hasMany(DetailRincianBiaya, {
    foreignKey: "biaya_toko_id",
    as: "detail_rincian_biaya",
})

DetailRincianBiaya.belongsTo(BiayaToko, {
    foreignKey: "biaya_toko_id",
    as: "biaya_toko",
})

BarangNonHandmade.hasMany(RincianBiaya, {
    foreignKey: "barang_non_handmade_id",
    as: "rincian_biaya",
})

RincianBiaya.belongsTo(BarangNonHandmade, {
    foreignKey: "barang_non_handmade_id",
    as: "barang_non_handmade",
})

Cabang.hasMany(RincianBiaya, {
    foreignKey: "cabang_id",
    as: "rincian_biaya",
})

RincianBiaya.belongsTo(Cabang, {
    foreignKey: "cabang_id",
    as: "cabang",
})

Pembelian.hasMany(ProdukPembelian, {
    foreignKey: "pembelian_id",
    as: "produk_pembelian",
})

ProdukPembelian.belongsTo(Pembelian, {
    foreignKey: "pembelian_id",
    as: "pembelian",
})

Cabang.hasMany(ProdukPembelian, {
    foreignKey: "cabang_id",
    as: "produk_pembelian",
})

ProdukPembelian.belongsTo(Cabang, {
    foreignKey: "cabang_id",
    as: "cabang",
})

BarangHandmade.hasMany(ProdukPembelian, {
    foreignKey: "barang_handmade_id",
    as: "produk_pembelian",
})

ProdukPembelian.belongsTo(BarangHandmade, {
    foreignKey: "barang_handmade_id",
    as: "barang_handmade",
})

BarangCustom.hasMany(ProdukPembelian, {
    foreignKey: "barang_custom_id",
    as: "produk_pembelian",
})

ProdukPembelian.belongsTo(BarangCustom, {
    foreignKey: "barang_custom_id",
    as: "barang_custom",
})

Packaging.hasMany(ProdukPembelian, {
    foreignKey: "packaging_id",
    as: "produk_pembelian",
})

ProdukPembelian.belongsTo(Packaging, {
    foreignKey: "packaging_id",
    as: "packaging",
})

BarangNonHandmade.hasMany(ProdukPembelian, {
    foreignKey: "barang_non_handmade_id",
    as: "produk_pembelian",
})

ProdukPembelian.belongsTo(BarangNonHandmade, {
    foreignKey: "barang_non_handmade_id",
    as: "barang_non_handmade",
})

Cabang.hasMany(StokBarang, {
    foreignKey: "cabang_id",
    as: "stok_barang",
})

StokBarang.belongsTo(Cabang, {
    foreignKey: "cabang_id",
    as: "cabang",
})

BarangHandmade.hasOne(StokBarang, {
    foreignKey: "barang_handmade_id",
    as: "stok_barang",
})

StokBarang.belongsTo(BarangHandmade, {
    foreignKey: "barang_handmade_id",
    as: "barang_handmade",
})

BarangNonHandmade.hasOne(StokBarang, {
    foreignKey: "barang_non_handmade_id",
    as: "stok_barang",
})

StokBarang.belongsTo(BarangNonHandmade, {
    foreignKey: "barang_non_handmade_id",
    as: "barang_non_handmade",
})

BarangCustom.hasOne(StokBarang, {
    foreignKey: "barang_custom_id",
    as: "stok_barang",
})

StokBarang.belongsTo(BarangCustom, {
    foreignKey: "barang_custom_id",
    as: "barang_custom",
})

Packaging.hasOne(StokBarang, {
    foreignKey: "packaging_id",
    as: "stok_barang",
})

StokBarang.belongsTo(Packaging, {
    foreignKey: "packaging_id",
    as: "packaging",
})

Penjualan.hasMany(ProdukPenjualan, {
    foreignKey: "penjualan_id",
    as: "produk_penjualan",
})

ProdukPenjualan.belongsTo(Penjualan, {
    foreignKey: "penjualan_id",
    as: "penjualan",
})

BarangHandmade.hasMany(ProdukPenjualan, {
    foreignKey: "barang_handmade_id",
    as: "produk_penjualan",
})

ProdukPenjualan.belongsTo(BarangHandmade, {
    foreignKey: "barang_handmade_id",
    as: "barang_handmade",
})

BarangNonHandmade.hasMany(ProdukPenjualan, {
    foreignKey: "barang_non_handmade_id",
    as: "produk_penjualan",
})

ProdukPenjualan.belongsTo(BarangNonHandmade, {
    foreignKey: "barang_non_handmade_id",
    as: "barang_non_handmade",
})

BarangCustom.hasMany(ProdukPenjualan, {
    foreignKey: "barang_custom_id",
    as: "produk_penjualan",
})

ProdukPenjualan.belongsTo(BarangCustom, {
    foreignKey: "barang_custom_id",
    as: "barang_custom",
})

Packaging.hasMany(ProdukPenjualan, {
    foreignKey: "packaging_id",
    as: "produk_penjualan",
})

ProdukPenjualan.belongsTo(Packaging, {
    foreignKey: "packaging_id",
    as: "packaging",
})
// Sync models with the database  
const syncDatabase = async () => {
    try {
        await sequelize.sync({ force: true }); // Use force: true only in development  
        //Seederrrr
        await require('./seed')();
        console.log("Database & tables created!");
    } catch (error) {
        console.error("Error syncing database:", error);
    }
};

syncDatabase();

module.exports = {
    sequelize
};
