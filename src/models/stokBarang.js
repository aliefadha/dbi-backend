const { DataTypes } = require("sequelize");  
const sequelize = require("../config/database");  
  
const StokBarang = sequelize.define("stok_barang", {  
  stok_barang_id: {  
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
  
module.exports = StokBarang;  
