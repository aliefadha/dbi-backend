const { DataTypes } = require("sequelize");  
const sequelize = require("../config/database");  
const MetodePembayaranGudang = require("./metodePembayaranGudang");
  
const PembelianGudang = sequelize.define("pembelian_gudang", {  
  pembelian_id: {  
    type: DataTypes.STRING,  
    allowNull: false,
    primaryKey: true,
  }, 
  tanggal: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  cash_or_non: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
  },
  metode_id: {
    type: DataTypes.INTEGER,
    references: {
      model: MetodePembayaranGudang,
      key: 'metode_id'
    },
    allowNull: true,
  },
  catatan: {
    type: DataTypes.TEXT,
  },
  sub_total: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  diskon: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  pajak: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  total_penjualan: {
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
  
module.exports = PembelianGudang;  
