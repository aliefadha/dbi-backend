const { DataTypes } = require("sequelize");  
const sequelize = require("../config/database");  
  
const KategoriPemasukan = sequelize.define("kategori_pemasukan", {  
  kategori_pemasukan_id: {  
    type: DataTypes.INTEGER,  
    allowNull: false,
    primaryKey: true,
    autoIncrement: true,
  }, 
  kategori_pemasukan: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  is_deleted: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  }
},{
  timestamps: false
});  
  
module.exports = KategoriPemasukan;  
