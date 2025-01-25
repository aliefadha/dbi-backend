const { DataTypes } = require("sequelize");  
const sequelize = require("../config/database");
  
const BiayaGudang = sequelize.define("biaya_gudang", {  
  biaya_gudang_id: {  
    type: DataTypes.INTEGER,  
    allowNull: false,
    primaryKey: true,
    autoIncrement: true,
  },
  total: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  rata_rata: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  total_biaya: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  waktu_kerja: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  total_modal: {
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
  
module.exports = BiayaGudang;  
