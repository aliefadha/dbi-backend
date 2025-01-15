const { DataTypes } = require("sequelize");  
const sequelize = require("../config/database");  
const Cabang = require("./cabang");
  
const TargetBulananKasir = sequelize.define("target_bulanan_kasir", {  
  target_bulanan_kasir_id: {  
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
  bulan: {
      type: DataTypes.STRING,
      allowNull: false,
  },
  jumlah_target: {
      type: DataTypes.INTEGER,
      allowNull: false,
  },  
},{
    timestamps: false,
});  
  
module.exports = TargetBulananKasir;  
