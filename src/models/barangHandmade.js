const { DataTypes } = require("sequelize");  
const sequelize = require("../config/database");  
  
const BarangHandmade = sequelize.define("barang_handmade", {  
  barang_handmade_id: {  
    type: DataTypes.INTEGER,  
    allowNull: false,
    primaryKey: true,
    autoIncrement: true,
  },  // dont forget to change to snake_case
  img_path: {  
    type: DataTypes.STRING,  
  },  
  // TODO: add more columns  
  // TODO: add relation to another table  
});  
  
module.exports = BarangHandmade;  
