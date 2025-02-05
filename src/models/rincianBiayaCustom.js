const { DataTypes } = require("sequelize");  
const sequelize = require("../config/database");  
const Penjualan = require("./penjualan");
  
const RincianBiayaCustom = sequelize.define("rincian_biaya_custom", {  
  rincian_biaya_custom_id: {  
    type: DataTypes.INTEGER,  
    allowNull: false,
    primaryKey: true,
    autoIncrement: true,
  }, 
  penjualan_id: {
    type: DataTypes.STRING,
    allowNull: false,
    references: {
      model: Penjualan,
      key: 'penjualan_id'
    }
  },
  nama_biaya: {
    type: DataTypes.STRING,
    allowNull: false
  },
  jumlah_biaya: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  is_deleted: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  }
},{
  timestamps: false
});  
  
module.exports = RincianBiayaCustom;  
