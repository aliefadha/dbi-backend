const { DataTypes } = require("sequelize");  
const sequelize = require("../config/database");  
  
const ProdukPembelian = sequelize.define("produk_pembelian", {  
  produk_pembelian_id: {  
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
  
module.exports = ProdukPembelian;  
