const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const Toko = require("./toko");

const MetodePembayaran = sequelize.define("metode_pembayaran", {
    metode_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
        unique: true,
    },
    nama_metode: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    toko_id: {
        type: DataTypes.INTEGER,
        references: {
            model: Toko,
            key: 'toko_id'
        }
    },
    is_deleted: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    }
}, {
    timestamps: false,
});

module.exports = MetodePembayaran;
