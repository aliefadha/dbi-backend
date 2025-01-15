const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const DivisiKaryawan = require("./divisiKaryawan");

const Karyawan = sequelize.define("karyawans", {
    karyawan_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
        unique: true,
    },
    image: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    email: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
    },
    nama_karyawan: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    divisi_karyawan_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: DivisiKaryawan,
            key: "divisi_karyawan_id",
        },
    },
    jumlah_gaji_pokok: {
        type: DataTypes.REAL,
        allowNull: false,
    },
    bonus: {
        type: DataTypes.REAL,
        allowNull: false,
    },
    waktu_kerja_sebulan_menit: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    waktu_kerja_sebulan_antar: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    nomor_handphone: {
        type: DataTypes.STRING,
        allowNull: true,
    }
}, {
    timestamps: false,
});


module.exports = Karyawan;  
