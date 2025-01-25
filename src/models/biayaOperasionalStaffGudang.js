const { DataTypes } = require("sequelize");  
const sequelize = require("../config/database");  
const BiayaGudang = require("./biayaGudang");
  
const BiayaOperasionalStaffGudang = sequelize.define("biaya_operasional_staff_gudang", {  
  biaya_staff_gudang_id: {  
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
  biaya_gudang_id: {
    type: DataTypes.INTEGER,
    references: {
      model: BiayaGudang,
      key: "biaya_gudang_id"
    }
  },
  is_deleted: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  }
},{
  timestamps: false
});  
  
module.exports = BiayaOperasionalStaffGudang;  
