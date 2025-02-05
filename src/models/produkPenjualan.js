const { DataTypes } = require("sequelize");  
const sequelize = require("../config/database");  
const Penjualan = require("./penjualan");
const BarangHandmade = require("./barangHandmade");
const BarangNonHandmade = require("./barangNonHandmade");
const BarangCustom = require("./barangCustom");
const Packaging = require("./packaging");
const Cabang = require("./cabang");
  
const ProdukPenjualan = sequelize.define("produk_penjualan", {  
  produk_penjualan_id: {  
    type: DataTypes.INTEGER,  
    allowNull: false,
    primaryKey: true,
    autoIncrement: true,
  }, 
  penjualan_id: {
    type: DataTypes.STRING,
    allowNull: false,
    references: {
      model: Penjualan,
      key: 'penjualan_id'
    }
  },
  cabang_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Cabang,
      key: "cabang_id"
    }
  },
  barang_handmade_id: {
    type: DataTypes.STRING,
    references: {
      model: BarangHandmade,
      key: 'barang_handmade_id'
    }
  },
  barang_non_handmade_id: {
    type: DataTypes.STRING,
    references: {
      model: BarangNonHandmade,
      key: 'barang_non_handmade_id'
    }
  },
  barang_custom_id: {
    type: DataTypes.STRING,
    references: {
      model: BarangCustom,
      key: 'barang_custom_id'
    }
  },
  packaging_id: {
    type: DataTypes.STRING,
    references: {
      model: Packaging,
      key: 'packaging_id'
    }
  },
  harga_satuan: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  kuantitas: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  total_biaya: {
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
  
module.exports = ProdukPenjualan;  
