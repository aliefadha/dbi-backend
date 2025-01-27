const { DataTypes } = require("sequelize");  
const sequelize = require("../config/database");  
const MetodePembayaranGudang = require("./metodePembayaranGudang");
  
const PenjualanGudang = sequelize.define("penjualan_gudang", {  
  penjualan_id: {  
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
    }
  },
  nama_pembeli: {
    type: DataTypes.STRING,
    allowNull: false
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
  
module.exports = PenjualanGudang;  
