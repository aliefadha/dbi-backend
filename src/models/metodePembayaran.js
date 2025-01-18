const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

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
    is_deleted: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    }
}, {
    timestamps: false,
});

module.exports = MetodePembayaran;
