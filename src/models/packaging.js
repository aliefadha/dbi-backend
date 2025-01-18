const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const JenisBarang = require("./jenisBarang");
const KategoriBarang = require("./kategoriBarang");

const Packaging = sequelize.define("packaging", {
    packaging_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
        unique: true,
    },
    image: {
        type: DataTypes.STRING
    },
    kategori_barang_id: {
        type: DataTypes.INTEGER,
        references: {
            model: KategoriBarang,
            key: 'kategori_barang_id'
        }
    },
    nama_packaging: {
        type: DataTypes.STRING,
        allowNull: false
    },
    ukuran: {
        type: DataTypes.STRING,
    },
    jumlah_minimum_stok: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
    },
    harga: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
    },
    isi: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
    },
    harga_satuan: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
    },
    is_deleted: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    }
}, {
    timestamps: false,
});

module.exports = Packaging;
