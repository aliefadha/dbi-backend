const { DataTypes } = require("sequelize");  
const sequelize = require("../config/database");  
const OperasionalProduksiGudang = require("./operasionalProduksiGudang");
const BiayaGudang = require("./biayaGudang");
  
const BiayaOperasionalProduksiGudang = sequelize.define("biaya_operasional_produksi_gudang", {  
  biaya_operasional_gudang_id: {  
    type: DataTypes.INTEGER,  
    allowNull: false,
    primaryKey: true,
    autoIncrement: true,
  }, 
  nama_biaya: {
    type: DataTypes.STRING,
    allowNull: false
  },
  total_biaya: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  biaya_gudang_id: {
    type: DataTypes.INTEGER,
    references: {
      model: BiayaGudang,
      key: "biaya_gudang_id"
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
