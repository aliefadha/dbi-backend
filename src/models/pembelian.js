const { DataTypes } = require("sequelize");  
const sequelize = require("../config/database");  
const MetodePembayaran = require("./metodePembayaran");
  
const Pembelian = sequelize.define("pembelian", {  
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
    allowNull: true,
    references: {
      model: MetodePembayaran,
      key: 'metode_id'
    }
  },
  catatan: {
    type: DataTypes.TEXT,
  },
  sub_total: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  diskon: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  pajak: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  total_pembelian: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  is_deleted: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  }
},{
  timestamps: false
});  
  
module.exports = Pembelian;  
