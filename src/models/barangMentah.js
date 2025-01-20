const { DataTypes } = require("sequelize");  
const sequelize = require("../config/database");  
  
const BarangMentah = sequelize.define("barang_mentah", {  
  barang_mentah_id: {  
    type: DataTypes.INTEGER,  
    allowNull: false,
    primaryKey: true,
    autoIncrement: true,
  }, 
  image: {
    type: DataTypes.STRING,  
  },
  nama_barang: {
    type: DataTypes.STRING,
  },
  jumlah_minimum_stok: {
    type: DataTypes.INTEGER,
  },
  harga: {
    type: DataTypes.INTEGER,
  },
  isi: {
    type: DataTypes.INTEGER
  },
  harga_satuan: {
    type: DataTypes.INTEGER,
  },
  is_deleted: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  }
},{
  timestamps: false
});  
  
module.exports = BarangMentah;  
