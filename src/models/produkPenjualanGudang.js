const { DataTypes } = require("sequelize");  
const sequelize = require("../config/database");  
const PenjualanGudang = require("./penjualanGudang");
const BarangNonHandmadeGudang = require("./barangNonHandmadeGudang");
const PackagingGudang = require("./packagingGudang");
  
const ProdukPenjualanGudang = sequelize.define("produk_penjualan_gudang", {  
  produk_penjualan_id: {  
    type: DataTypes.INTEGER,  
    allowNull: false,
    primaryKey: true,
    autoIncrement: true,
  }, 
  penjualan_id: {
    type: DataTypes.INTEGER,
    references: {
      model: PenjualanGudang,
      key: 'penjualan_id'
    }
  },
  packaging_id: {
    type: DataTypes.INTEGER,
    references: {
      model: PackagingGudang,
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
  
module.exports = ProdukPenjualanGudang;  
