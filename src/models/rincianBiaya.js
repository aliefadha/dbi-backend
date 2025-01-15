const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const BarangHandmadeNon = require("./barangHandmadeNon");

const RincianBiaya = sequelize.define('rincian-biaya', {
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
            model: BarangHandmadeNon,
            key: 'barang_id'
        }
    },
    nama_biaya: {
        type: DataTypes.STRING,
    },
    jumlah_biaya: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    }
})

RincianBiaya.belongsTo(BarangHandmadeNon, {
    foreignKey: 'barang_id'
})

module.exports = RincianBiaya