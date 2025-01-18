const { DataTypes } = require("sequelize");  
const sequelize = require("../config/database");  
  
const Toko = sequelize.define("toko", {  
  toko_id: {  
    type: DataTypes.INTEGER,  
    allowNull: false,
    primaryKey: true,
    autoIncrement: true,
  }, 
  image: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  nama_toko: {
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
  is_deleted: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  }
});  
  
module.exports = Toko;  
