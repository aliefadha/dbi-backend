const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const KategoriBarang = require("./kategoriBarang");
const Packaging = require("./packaging");
const JenisBarang = require("./jenisBarang");

const BarangNonHandmade = sequelize.define("barang_nonhandmade", {
    barang_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
        unique: true,
    },
    img: {
        type: DataTypes.STRING,
    },
    nama_barang: {
        type: DataTypes.STRING,
        allowNull: false
    },
    kategori_barang_id: {
        type: DataTypes.INTEGER,
        references: {
            model: KategoriBarang,
            key: 'kategori_barang_id'
        }
    },
    jenis_barang_id: {
        type: DataTypes.INTEGER,
        references: {
            model: JenisBarang,
            key: 'jenis_barang_id'
        }
    },
    jumlah_minimum_stok: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
    },
    keuntungan: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
    },
    harga_jual: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
    },
    packaging_id: {
        type: DataTypes.INTEGER,
        references: {
            model: Packaging,
            key: 'packaging_id'
        }
    },
}, {
    timestamps: false,
});

module.exports = BarangNonHandmade;
