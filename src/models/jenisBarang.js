const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const JenisBarang = sequelize.define("jenis_barang", {
  jenis_barang_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  jenis_barang: {
    type: DataTypes.STRING,
    allowNull: false,
  },
},
  {
    timestamps: false,
  });

module.exports = JenisBarang;  
