
const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Packaging = sequelize.define("packaging", {
    packaging: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
        unique: true,
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
    }
}, {
    timestamps: false,
});

module.exports = Packaging;
