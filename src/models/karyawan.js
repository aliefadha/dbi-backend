const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const DivisiKaryawan = require("./divisiKaryawan");
const Cabang = require("./cabang");
const Toko = require("./toko");

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
    detail_password: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    divisi_karyawan_id: {
        type: DataTypes.INTEGER,
        references: {
            model: DivisiKaryawan,
            key: "divisi_karyawan_id",
        },
    },
    jenis_karyawan: {
        type: DataTypes.ENUM("Umum", "Produksi", "Transportasi"),
        defaultValue: "Umum",
        allowNull: true,
    },
    toko_id: {
        type: DataTypes.INTEGER,
        references: {
            model: Toko,
            key: "toko_id",
        },
    },
    cabang_id_first: {
        type: DataTypes.INTEGER,
        references: {
            model: Cabang,
            key: "cabang_id",
        },
    },
    cabang_id: {
        type: DataTypes.INTEGER,
        references: {
            model: Cabang,
            key: "cabang_id",
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
    label: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: "APM"
    },
    nomor_handphone: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    is_deleted: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
    },
}, {
    timestamps: true,
});


module.exports = Karyawan;  
