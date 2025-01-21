const { DataTypes } = require("sequelize");  
const sequelize = require("../config/database");  
const OperasionalProduksiGudang = require("./operasionalProduksiGudang");
  
const BiayaOperasionalProduksiGudang = sequelize.define("biaya_operasional_produksi_gudang", {  
  biaya_operasional_produksi_gudang_id: {  
    type: DataTypes.INTEGER,  
    allowNull: false,
    primaryKey: true,
    autoIncrement: true,
  }, 
  nama_divisi: {
    type: DataTypes.STRING,
    allowNull: false
  },
  total_biaya: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  operasional_produksi_id: {
    type: DataTypes.INTEGER,
    references: {
      model: OperasionalProduksiGudang,
      key: "operasional_produksi_id"
    }
  },
  is_deleted: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  }
},{
  timestamps: false
});  
  
module.exports = BiayaOperasionalProduksiGudang;  
