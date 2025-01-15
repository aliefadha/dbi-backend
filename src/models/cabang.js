const { DataTypes } = require("sequelize");  
const sequelize = require("../config/database");  
  
const Cabang = sequelize.define("cabang", {  
  cabang_id: {  
      type: DataTypes.INTEGER,  
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
  },  
  nama_cabang: {  
      type: DataTypes.STRING,
      allowNull: false,  
  },  
  email: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
  },
  password: {
      type: DataTypes.STRING,
      allowNull: false,
  },  
},{
    timestamps: false,
});  
  
module.exports = Cabang;  
