const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const Karyawan = require("./karyawan");

const ProduksiGudang = sequelize.define("produksi_gudang", {
  produksi_gudang_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true,
  },
  karyawan_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Karyawan,
      key: "karyawan_id"
    }
  },
  image: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  tanggal: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  jumlah_produksi: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  total_menit: {
    type: DataTypes.INTEGER,
  },
  status: {
    type: DataTypes.ENUM('terima', 'tolak', 'proses'),
    defaultValue: 'proses',
    allowNull: false
  },
  gaji_pokok_perhari: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  lng: {
    type: DataTypes.REAL,
    allowNull: true,
  },
  lat: {
      type: DataTypes.REAL,
      allowNull: true,
  },
  is_deleted: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },

}, {
  timestamps: false
});

module.exports = ProduksiGudang;  
