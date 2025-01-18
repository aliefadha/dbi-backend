const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const Pembelian = require("./pembelian");
const Cabang = require("./cabang");
const Barang = require("./barang");

const ProdukPembelian = sequelize.define("produk_pembelian", {
  produk_pembelian_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true,
  },
  pembelian_id: {
    type: DataTypes.INTEGER,
    references: {
      model: Pembelian,
      key: 'pembelian_id'
    },
  },
  barang_id: {
    type: DataTypes.INTEGER,
    references: {
      model: Barang,
      key: 'barang_id'
    },
  },
  kuantitas: {
    type: DataTypes.INTEGER,
  },
  total_biaya: {
    type: DataTypes.INTEGER
  },
  cabang_id :{
    type: DataTypes.INTEGER,
    references: {
      model: Cabang,
      key: 'cabang_id'
    }
  }
}, {
  timestamps: false
});

module.exports = ProdukPembelian;  
