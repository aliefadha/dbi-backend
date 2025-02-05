const { DataTypes } = require("sequelize");  
const sequelize = require("../config/database");  
const MetodePembayaran = require("./metodePembayaran");
const Cabang = require("./cabang");
  
const Penjualan = sequelize.define("penjualan", {  
  penjualan_id: {  
    type: DataTypes.STRING,  
    allowNull: false,
    primaryKey: true,
  },
  cabang_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Cabang,
      key: 'cabang_id',
    }
  },
  tanggal: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  nama_pembeli: {
    type: DataTypes.STRING,
    allowNull: false
  },
  cash_or_non: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
  },
  metode_id: {
    type: DataTypes.INTEGER,
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
    defaultValue: 0
  },
  total_penjualan: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  is_deleted: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  }
},{
  timestamps: true
});  
  
module.exports = Penjualan;  
