const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const BarangHandmade = require("./barangHandmade");
const BarangNonHandmade = require("./barangNonHandmade");
const Cabang = require("./cabang");

const RincianBiaya = sequelize.define('rincian_biaya', {
    rincian_biaya_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
        unique: true,
    },
    barang_handmade_id: {
        type: DataTypes.STRING,
        allowNull: true,
        references: {
            model: BarangHandmade,
            key: "barang_handmade_id",
        }
    },
    barang_non_handmade_id: {
        type: DataTypes.STRING,
        allowNull: true,
        references: {
            model: BarangNonHandmade,
            key: "barang_non_handmade_id",
        }
    },
    cabang_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Cabang,
            key: "cabang_id",
        }
    },
    total_hpp: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    keuntungan: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    harga_jual: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    harga_jual_ideal: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
    },
    margin_persentase: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
    },
    margin_nominal: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
    },
    harga_logis: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
    },
    is_deleted: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    }
}, {
    timestamps: false
})

module.exports = RincianBiaya