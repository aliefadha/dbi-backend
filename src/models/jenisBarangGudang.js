const { DataTypes } = require("sequelize");  
const sequelize = require("../config/database");  
  
const JenisBarangGudang = sequelize.define("jenis_barang_gudang", {  
  jenis_barang_id: {  
    type: DataTypes.INTEGER,  
    allowNull: false,
    primaryKey: true,
    autoIncrement: true,
  },
  nama_jenis_barang: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  is_deleted: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  }
}, {
  timestamps: false
});  
  
module.exports = JenisBarangGudang;  
