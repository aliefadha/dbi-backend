const { DataTypes } = require("sequelize");  
const sequelize = require("../config/database");  
const KategoriPengeluaran = require("./kategoriPengeluaran");
const MetodePembayaran = require("./metodePembayaran");
  
const Pengeluaran = sequelize.define("pengeluaran", {  
  pengeluaran_id: {  
    type: DataTypes.STRING,  
    allowNull: false,
    primaryKey: true,
  }, 
  tanggal: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  kategori_pengeluaran_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: KategoriPengeluaran,
      key: 'kategori_pengeluaran_id'
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
  
module.exports = Pengeluaran;  
