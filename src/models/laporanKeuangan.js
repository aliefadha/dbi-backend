const { DataTypes } = require("sequelize");  
const sequelize = require("../config/database");  
  
const LaporanKeuangan = sequelize.define("laporan_keuangan", {  
  laporan_keuangan_id: {  
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
  
module.exports = LaporanKeuangan;  
