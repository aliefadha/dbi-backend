const { DataTypes } = require("sequelize");  
const sequelize = require("../config/database");
const BiayaToko = require("./biayaToko");  
const OperasionalProduksiGudang = require("./operasionalProduksiGudang");
  
const BiayaOperasional = sequelize.define("biaya_operasional", {  
  biaya_operasional_id: {  
    type: DataTypes.INTEGER,  
    allowNull: false,
    primaryKey: true,
    autoIncrement: true,
  }, 
  biaya_toko_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
        model: BiayaToko,
        key: "biaya_toko_id",
    },
  },
  nama_biaya: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  jumlah_biaya: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  is_deleted: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  }
},{
  timestamps: false
});  
  
module.exports = BiayaOperasional;  
