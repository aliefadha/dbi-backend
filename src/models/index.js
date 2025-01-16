// relation files

// models/relation.js  
const sequelize = require('../config/database');
const BarangHandmadeNon = require('./barangHandmadeNon');
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


KategoriBarang.hasMany(BarangHandmadeNon, {
    foreignKey: 'kategori_barang_id',
    as: "barang"
});

JenisBarang.hasMany(BarangHandmadeNon, {
    foreignKey: 'jenis_barang_id',
    as: "barang"
});

Packaging.hasMany(BarangHandmadeNon, {
    foreignKey: 'packaging_id',
    as: "barang"
})

BarangHandmadeNon.belongsTo(KategoriBarang, {
    foreignKey: 'kategori_barang_id',
    as: "kategori",
})

BarangHandmadeNon.belongsTo(JenisBarang, {
    foreignKey: "jenis_barang_id",
    as: "jenis",
})

BarangHandmadeNon.belongsTo(Packaging, {
    foreignKey: "packaging_id",
    as: "packaging",
})

ProdukPenjualan.belongsTo(BarangHandmadeNon, {
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
