const { DataTypes } = require("sequelize");  
const sequelize = require("../config/database");  
  
const OperasionalProduksiGudang = sequelize.define("operasional_produksi_gudang", {  
  operasional_produksi_id: {  
    type: DataTypes.INTEGER,  
    allowNull: false,
    primaryKey: true,
    autoIncrement: true,
  },
  nama_tabel: {
    type: DataTypes.STRING,
    allowNull: false
  },
  total: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  waktu_kerja: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  total_modal: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  is_deleted: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  }
},{
  timestamps: false
});  
  
module.exports = OperasionalProduksiGudang;  
