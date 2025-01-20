const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const MetodePembayaranGudang = sequelize.define("metode_pembayaran_gudang", {
  metode_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true,
  },
  nama_metode: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  is_deleted: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  }
}, {
  timestamps: false
});

module.exports = MetodePembayaranGudang;  
