const { DataTypes } = require("sequelize");  
const sequelize = require("../config/database");  
  
const ProduksiGudang = sequelize.define("produksi_gudang", {  
  produksi_gudang_id: {  
    type: DataTypes.INTEGER,  
    allowNull: false,
    primaryKey: true,
    autoIncrement: true,
  },
  image: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  tanggal: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  jumlah_produksi: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  total_menit: {
    type: DataTypes.INTEGER,
  },
  status: {
    type: DataTypes.BOOLEAN,
  },
  is_deleted: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
},{
  timestamps: false
});  
  
module.exports = ProduksiGudang;  
