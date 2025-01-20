const { DataTypes } = require("sequelize");  
const sequelize = require("../config/database");  
const BarangNonHandmadeGudang = require("./barangNonHandmadeGudang");
const BarangMentah = require("./barangMentah");
const PackagingGudang = require("./packagingGudang");
  
const StokBarangGudang = sequelize.define("stok_barang_gudang", {  
  stok_barang_gudang_id: {  
    type: DataTypes.INTEGER,  
    allowNull: false,
    primaryKey: true,
    autoIncrement: true,
  },
  barang_id: {
    type: DataTypes.INTEGER,
    references: {
      model: BarangNonHandmadeGudang,
      key: 'barang_id'
    }
  },
  barang_mentah_id: {
    type: DataTypes.INTEGER,
    references: {
      model: BarangMentah,
      key: 'barang_mentah_id'
    }
  },
  packaging_id: {
    type: DataTypes.INTEGER,
    references: {
      model: PackagingGudang,
      key: 'packaging_id'
    }
  },
  jumlah_stok: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  is_deleted: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  }
},{
  timestamps: false
});  
  
module.exports = StokBarangGudang;  
