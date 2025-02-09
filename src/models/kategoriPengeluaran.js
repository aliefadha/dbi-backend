const { DataTypes } = require("sequelize");  
const sequelize = require("../config/database");  
  
const KategoriPengeluaran = sequelize.define("kategori_pengeluaran", {  
  kategori_pengeluaran_id: {  
    type: DataTypes.INTEGER,  
    allowNull: false,
    primaryKey: true,
    autoIncrement: true,
  }, 
  kategori_pengeluaran: {
    type: DataTypes.STRING,
    allowNull: false
  },
  is_deleted: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  }
},{
  timestamps: false
});  
  
module.exports = KategoriPengeluaran;  
