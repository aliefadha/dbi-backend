// relation files

// models/relation.js  
const sequelize = require('../config/database');
const BarangNonHandmade = require('./barangNonHandmade');
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


KategoriBarang.hasMany(BarangNonHandmade, {
    foreignKey: 'kategori_barang_id',
    as: "barang"
});

JenisBarang.hasMany(BarangNonHandmade, {
    foreignKey: 'jenis_barang_id',
    as: "barang"
});

Packaging.hasMany(BarangNonHandmade, {
    foreignKey: 'packaging_id',
    as: "barang"
})

BarangNonHandmade.belongsTo(KategoriBarang, {
    foreignKey: 'kategori_barang_id',
    as: "kategori",
})

BarangNonHandmade.belongsTo(JenisBarang, {
    foreignKey: "jenis_barang_id",
    as: "jenis",
})

BarangNonHandmade.belongsTo(Packaging, {
    foreignKey: "packaging_id",
    as: "packaging",
})

ProdukPenjualan.belongsTo(BarangNonHandmade, {
    foreignKey: "barang_id",
    as: "barang",
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
