const { DataTypes } = require("sequelize");  
const sequelize = require("../config/database");  
const Pemasukan = require("./pemasukan");
const Toko = require("./toko");
const Cabang = require("./cabang");
  
const DeskripsiPemasukan = sequelize.define("deskripsi_pemasukan", {  
  deskripsi_pemasukan_id: {  
    type: DataTypes.INTEGER,  
    allowNull: false,
    primaryKey: true,
    autoIncrement: true,
  }, 
  pemasukan_id: {
    type: DataTypes.STRING,
    allowNull: false,
    references: {
      model: Pemasukan,
      key: 'pemasukan_id'
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
  jumlah_pemasukan: {
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
  
module.exports = DeskripsiPemasukan;  
