const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const KategoriBarang = require("./kategoriBarang");

const BarangHandmadeNon = sequelize.define("barang_handmadenon", {
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
        defaultValue: 0,
    },
}, {
    timestamps: false,
});

BarangHandmadeNon.belongsTo(KategoriBarang, {
    foreignKey: 'kategori_barang_id'
})

module.exports = BarangHandmadeNon;
