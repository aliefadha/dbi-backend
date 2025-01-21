const { DataTypes } = require("sequelize");  
const sequelize = require("../config/database");  
const BiayaToko = require("./biayaToko");
  
const BiayaStaff = sequelize.define("biaya_staff", {  
  biaya_staff_id: {  
    type: DataTypes.INTEGER,  
    allowNull: false,
    primaryKey: true,
    autoIncrement: true,
  }, 
  biaya_toko_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
        model: BiayaToko,
        key: "biaya_toko_id",
    },
  },
  nama_biaya: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  jumlah_biaya: {
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
  
module.exports = BiayaStaff;  
