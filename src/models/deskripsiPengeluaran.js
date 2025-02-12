const { DataTypes } = require("sequelize");  
const sequelize = require("../config/database");  
const Pengeluaran = require("./pengeluaran");
const Toko = require("./toko");
const Cabang = require("./cabang");
  
const DeskripsiPengeluaran = sequelize.define("deskripsi_pengeluaran", {  
  deskripsi_pengeluaran_id: {  
    type: DataTypes.INTEGER,  
    allowNull: false,
    primaryKey: true,
    autoIncrement: true,
  }, 
  pengeluaran_id: {
    type: DataTypes.STRING,
    allowNull: false,
    references: {
      model: Pengeluaran,
      key: 'pengeluaran_id'
    }
  },
  deskripsi: {
    type: DataTypes.STRING,
    allowNull: false
  },
  toko_id: {
    type: DataTypes.INTEGER,
    references: {
      model: Toko,
      key: 'toko_id'
    }
  },
  cabang_id: {
    type: DataTypes.INTEGER,
    references: {
      model: Cabang,
      key: 'cabang_id'
    }
  },
  jumlah_pengeluaran: {
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
  
module.exports = DeskripsiPengeluaran;  
