const { DataTypes } = require("sequelize");  
const sequelize = require("../config/database");  
const Toko = require("./toko");

const Cabang = sequelize.define("cabang", {  
  cabang_id: {  
      type: DataTypes.INTEGER,  
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
  },  
  toko_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
          model: Toko,
          key: 'toko_id'
      }
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
  detail_password: {
      type: DataTypes.STRING,
      allowNull: false,
  },
  is_deleted: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
  }
},{
    timestamps: false,
});  
  
module.exports = Cabang;  
