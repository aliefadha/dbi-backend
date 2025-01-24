// relation files

// models/relation.js  
const sequelize = require('../config/database');
const DivisiKaryawan = require('./divisiKaryawan');
const JenisBarang = require('./jenisBarang');
const Karyawan = require('./karyawan');
const KategoriBarang = require('./kategoriBarang');
const Kpi = require('./kpi');
const Packaging = require('./packaging');
const ProdukPenjualan = require('./produkPenjualan');
const Cabang = require('./cabang');
const TargetBulananKasir = require('./targetBulananKasir');
const CutiKaryawan = require('./cutiKaryawan');
const AbsensiKaryawan = require('./absensiKaryawan');
const BarangCustom = require("./barangCustom");
const KpiKaryawan = require("./kpiKaryawan");
const MetodePembayaran = require('./metodePembayaran');
const Penjualan = require('./penjualan');
const Pembelian = require('./pembelian');
const ProdukPembelian = require('./produkPembelian');
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
    as: "barang", 
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
    as: "barang",
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

BarangNonHandmadeGudang.belongsTo(JenisBarangGudang, {
    foreignKey: "jenis_barang_id",
    as: "jenis",
})

BarangNonHandmadeGudang.hasMany(RincianBiayaGudang, {
    foreignKey: "rincian_biaya_id",
    as: "rincian_biaya"
})

BarangNonHandmadeGudang.hasMany(ProdukPembelianGudang, {
    foreignKey: "barang_id",
    as: "produk_pembelian"
})

RincianBiayaGudang.belongsTo(BarangNonHandmadeGudang ,{
    foreignKey: "barang_id",
    as: "barang_nonhandmade"
})

BarangNonHandmadeGudang.hasMany(RincianBahanGudang, {
    foreignKey: "barang_id",
    as: "rincian_bahan"
})

RincianBahanGudang.belongsTo(BarangNonHandmadeGudang, {
    foreignKey: "barang_id",
    as: "barang_nonhandmade"
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
    foreignKey: "barang_id",
    as: "barang_nonhandmade"
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
    foreignKey: "barang_id",
    as: "barang_nonhandmade"
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
    foreignKey: "barang_id",
    as: "stok_barang"
})

StokBarangGudang.belongsTo(BarangNonHandmadeGudang, {
    foreignKey: "barang_id",
    as: "barang_nonhandmade"
})

StokBarangGudang.belongsTo(BarangMentah, {
    foreignKey: "barang_mentah_id",
    as: "barang_mentah"
})

BarangMentah.hasOne(StokBarangGudang, {
    foreignKey: "barang_mentah_id",
    as: "stok_barang"
})

BarangProduksiGudang.belongsTo(BarangNonHandmadeGudang, {
    foreignKey: "barang_id",
    as: "barang"
})

BiayaOperasionalProduksiGudang.belongsTo(OperasionalProduksiGudang, {
    foreignKey: "operasional_produksi_id",
    as: 'operasional'
})

OperasionalProduksiGudang.hasMany(BiayaOperasionalProduksiGudang, {
    foreignKey: "operasional_produksi_id",
    as: "biaya"
})

BiayaOperasionalStaffGudang.belongsTo(OperasionalStaffGudang, {
    foreignKey: "operasional_staff_id",
    as: 'operasional'
})

OperasionalStaffGudang.hasMany(BiayaOperasionalStaffGudang, {
    foreignKey: "operasional_staff_id",
    as: "biaya"
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
    foreignKey: "metode_pembayaran_id",
    as: 'penjualan'
});

MetodePembayaran.hasMany(Pembelian, {
    foreignKey: "metode_pembayaran_id",
    as: "pembelian"
})

// Penjualan.belongsTo(MetodePembayaran, {
//     foreignKey: "metode_pembayaran_id",
//     as: "metode"
// })

// ProdukPenjualan.belongsTo(BarangNonHandmade, {
//     foreignKey: "barang_id",
//     as: "barang",
// })


// Penjualan.hasMany(ProdukPenjualan, {
//     foreignKey: "penjualan_id",
//     as: "produk",
// });

// ProdukPenjualan.belongsTo(Penjualan, {
//     foreignKey: "penjualan_id",
//     as: 'penjualan'
// })

// Pembelian.hasMany(ProdukPembelian, {
//     foreignKey: "pembelian_id",
//     as: "produk"
// })

// ProdukPembelian.belongsTo(Pembelian, {
//     foreignKey: "pembelian_id",
//     as: "pembelian"
// })

// ProdukPembelian.belongsTo(Cabang, {
//     foreignKey: "cabang_id",
//     as: "cabang"
// })

// ProdukPenjualan.belongsTo(Cabang, {
//     foreignKey: "cabang_id",
//     as: "cabang"
// })

// ProdukPembelian.belongsTo(BarangNonHandmade, {
//     foreignKey: "barang_id",
//     as: "barang",
// })

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
