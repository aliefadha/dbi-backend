const { DataTypes } = require("sequelize");  
const sequelize = require("../config/database");  
const BarangHandmade = require("./barangHandmade");
const BarangNonHandmade = require("./barangNonHandmade");
const BarangCustom = require("./barangCustom");
const Packaging = require("./packaging");
const Cabang = require("./cabang");
const Toko = require("./toko");
  
const StokBarang = sequelize.define("stok_barang", {  
  stok_barang_id: {  
    type: DataTypes.INTEGER,  
    allowNull: false,
    primaryKey: true,
    autoIncrement: true,
  }, 
  toko_id: {
    type: DataTypes.INTEGER,
    references: {
      model: Toko,
      key: 'toko_id'
    }
  },
  cabang_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Cabang,
      key: 'cabang_id'
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
  jumlah_stok: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  is_deleted: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  }
},{
  timestamps: false
});  
  
module.exports = StokBarang;  
