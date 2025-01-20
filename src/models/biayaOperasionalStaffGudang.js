const { DataTypes } = require("sequelize");  
const sequelize = require("../config/database");  
  
const BiayaOperasionalStaffGudang = sequelize.define("biaya_operasional_staff_gudang", {  
  biaya_operasional_staff_gudang_id: {  
    type: DataTypes.INTEGER,  
    allowNull: false,
    primaryKey: true,
    autoIncrement: true,
  }, 
  nama_biaya: {
    type: DataTypes.STRING,
    allowNull: false
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
  
module.exports = BiayaOperasionalStaffGudang;  
