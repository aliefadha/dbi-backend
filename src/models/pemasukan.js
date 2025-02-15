const { DataTypes } = require("sequelize");  
const sequelize = require("../config/database");  
const KategoriPemasukan = require("./kategoriPemasukan");
const MetodePembayaran = require("./metodePembayaran");
  
const Pemasukan = sequelize.define("pemasukan", {  
  pemasukan_id: {  
    type: DataTypes.STRING,  
    allowNull: false,
    primaryKey: true,
  }, 
  tanggal: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  kategori_pemasukan_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: KategoriPemasukan,
      key: 'kategori_pemasukan_id'
    }
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
  total: {
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
  
module.exports = Pemasukan;  
