const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const BarangHandmadeGudang = require("./barangHandmadeGudang");
const BarangNonHandmadeGudang = require("./barangNonHandmadeGudang");

const RincianBiayaGudang = sequelize.define("rincian_biaya_gudang", {
  rincian_biaya_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true,
  },
  barang_handmade_id: {
    type: DataTypes.STRING,
    references: {
      model: BarangHandmadeGudang,
      key: 'barang_handmade_id'
    }
  },
  barang_nonhandmade_id: {
    type: DataTypes.STRING,
    references: {
      model: BarangNonHandmadeGudang,
      key: 'barang_nonhandmade_id'
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
},{
  timestamps: false
});

module.exports = RincianBiayaGudang;
