const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const barangNonHandmade = require("./barangNonHandmade");

const RincianBiaya = sequelize.define('rincian_biaya', {
    rincian_biaya_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
        unique: true,
    },
    barang_id: {
        type: DataTypes.INTEGER,
        references: {
            model: barangNonHandmade,
            key: 'barang_id'
        }
    },
    nama_biaya: {
        type: DataTypes.STRING,
    },
    jumlah_biaya: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    },
    is_deleted: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    }
}, {
    timestamps: false
})

module.exports = RincianBiaya