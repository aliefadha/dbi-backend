const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const BarangNonHandmade = require("./barangNonHandmade");
const Penjualan = require("./penjualan");
const Cabang = require("./cabang");

const ProdukPenjualan = sequelize.define("produk_penjualan", {
  produk_penjualan_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true,
  },
  penjualan_id: {
    type: DataTypes.INTEGER,
    references: {
      model: Penjualan,
      key: 'penjualan_id'
    },
  },
  barang_id: {
    type: DataTypes.STRING,
    references: {
      model: BarangNonHandmade,
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

module.exports = ProdukPenjualan;  
