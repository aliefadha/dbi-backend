const { DataTypes } = require("sequelize");  
const sequelize = require("../config/database");  
  
const DivisiKaryawan = sequelize.define("divisi_karyawan", {  
  divisi_karyawan_id: {  
    type: DataTypes.INTEGER,  
    allowNull: false,
    primaryKey: true,
    autoIncrement: true,
  }, 
  nama_divisi: {
    type: DataTypes.STRING,
    allowNull: false,
  },

  is_deleted: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  }
}
, {
  timestamps: false,
});  
  
module.exports = DivisiKaryawan;  
