const { DataTypes } = require("sequelize");  
const sequelize = require("../config/database");  
const BarangMentah = require("./barangMentah");
const BarangNonHandmadeGudang = require("./barangNonHandmadeGudang");
  
const RincianBahanGudang = sequelize.define("rincian_bahan_gudang", {  
  rincian_bahan_id: {  
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
  
module.exports = RincianBahanGudang;  
