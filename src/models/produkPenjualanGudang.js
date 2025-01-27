const { DataTypes } = require("sequelize");  
const sequelize = require("../config/database");  
const PenjualanGudang = require("./penjualanGudang");
const BarangNonHandmadeGudang = require("./barangNonHandmadeGudang");
const PackagingGudang = require("./packagingGudang");
const BarangHandmadeGudang = require("./barangHandmadeGudang");
const BarangMentah = require("./barangMentah");
  
const ProdukPenjualanGudang = sequelize.define("produk_penjualan_gudang", {  
  produk_penjualan_id: {  
    type: DataTypes.INTEGER,  
    allowNull: false,
    primaryKey: true,
    autoIncrement: true,
  }, 
  penjualan_id: {
    type: DataTypes.STRING,
    references: {
      model: PenjualanGudang,
      key: 'penjualan_id'
    }
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
  packaging_id: {
    type: DataTypes.STRING,
    references: {
      model: PackagingGudang,
      key: 'packaging_id'
    }
  },
  barang_mentah_id: {
    type: DataTypes.STRING,
    references: {
      model: BarangMentah,
      key: 'barang_mentah_id'
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
  
module.exports = ProdukPenjualanGudang;  
