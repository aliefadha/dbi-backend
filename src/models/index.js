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

// Sync models with the database  
const syncDatabase = async () => {
    try {
        await sequelize.sync({ force: false }); // Use force: true only in development  
        console.log("Database & tables created!");
    } catch (error) {
        console.error("Error syncing database:", error);
    }
};

syncDatabase();

module.exports = {
    sequelize
};  
