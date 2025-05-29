const { DataTypes } = require("sequelize");  
const sequelize = require("../config/database");  
const Cabang = require("./cabang");
  
const BiayaToko = sequelize.define("biaya_toko", {  
  biaya_toko_id: {  
    type: DataTypes.INTEGER,  
    allowNull: false,
    primaryKey: true,
    autoIncrement: true,
  }, 
  cabang_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
        model: Cabang,
        key: "cabang_id",
    },
  },
  total: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  rata_rata: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  total_biaya: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  persentase: {
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
  
module.exports = BiayaToko;  
