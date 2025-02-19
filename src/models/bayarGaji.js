const { DataTypes } = require("sequelize");  
const sequelize = require("../config/database");  
const KategoriPengeluaran = require("./kategoriPengeluaran");
const MetodePembayaran = require("./metodePembayaran");
  
const BayarGaji = sequelize.define("bayar_gaji", {  
  bayar_gaji_id: {  
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
    references: {
      model: MetodePembayaran,
      key: 'metode_id'
    }
  },
  total: {
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
  
module.exports = BayarGaji;  
