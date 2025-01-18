const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const Cabang = require("./cabang");
const Barang = require("./barang");

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
      model: Barang,
      key: 'barang_id'
    }
  },
  cabang_id: {
    type: DataTypes.INTEGER,
    references: {
      model: Cabang,
      key: 'cabang_id'
    }
  },
  total_hpp: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  keuntungan: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  harga_jual: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  is_deleted: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  }
},
  { timestamps: false }
);


module.exports = Bundling;  
