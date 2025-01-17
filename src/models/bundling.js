const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const BarangNonHandmade = require("./barangNonHandmade");
const Packaging = require("./packaging");
const RincianBiaya = require("./rincianBiaya");
const Cabang = require("./cabang");

const Bundling = sequelize.define("bundling", {
  bundling_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true,
  },
  barang_id: {
    type: DataTypes.INTEGER,
    references: {
      model: BarangNonHandmade,
      key: 'barang_id'
    },
  },
  packaging_id: {
    type: DataTypes.INTEGER,
    references: {
      model: Packaging,
      key: 'packaging_id'
    },
  },
  rincian_biaya_id: {
    type: DataTypes.INTEGER,
    references: {
      model: RincianBiaya,
      key: 'rincian_biaya_id'
    },
  },
  cabang_id: {
    type: DataTypes.INTEGER,
    references: {
      model: Cabang,
      key: 'cabang_id'
    },
  },
});

module.exports = Bundling;  
