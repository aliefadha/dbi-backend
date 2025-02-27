const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const PackagingGudang = sequelize.define("packaging_gudang", {
  packaging_id: {
    type: DataTypes.STRING,
    allowNull: false,
    primaryKey: true,
  },
  image: {
    type: DataTypes.STRING
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
  },
  harga_jual: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  is_deleted: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  }
}, {
  timestamps: false
});

module.exports = PackagingGudang;  
