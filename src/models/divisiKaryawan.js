const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const DivisiKaryawan = sequelize.define("divisi_karyawans", {
    divisi_karyawan_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
        unique: true,
    },
    nama_divisi: {
        type: DataTypes.STRING,
        allowNull: false,
    }
}, {
    timestamps: false,
});

module.exports = DivisiKaryawan;