const { DataTypes } = require("sequelize");  
const sequelize = require("../config/database");  
  
const DeskripsiPemasukan = sequelize.define("deskripsi_pemasukan", {  
  deskripsi_pemasukan_id: {  
    type: DataTypes.INTEGER,  
    allowNull: false,
    primaryKey: true,
    autoIncrement: true,
  }, 
  is_deleted: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  }
},{
  timestamps: false
});  
  
module.exports = DeskripsiPemasukan;  
