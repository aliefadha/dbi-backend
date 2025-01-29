const { DataTypes } = require("sequelize");  
const sequelize = require("../config/database");  
const Pembelian = require("./pembelian");
const BarangHandmade = require("./barangHandmade");
const BarangNonHandmade = require("./barangNonHandmade");
const BarangCustom = require("./barangCustom");
const Packaging = require("./packaging");
const Cabang = require("./cabang");
  
const ProdukPembelian = sequelize.define("produk_pembelian", {  
  produk_pembelian_id: {  
    type: DataTypes.INTEGER,  
    allowNull: false,
    primaryKey: true,
    autoIncrement: true,
  }, 
  pembelian_id: {
    type: DataTypes.STRING,
    references: {
      model: Pembelian,
      key: 'pembelian_id'
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
  barang_nonhandmade_id: {
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
  
module.exports = ProdukPembelian;  
