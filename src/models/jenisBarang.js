const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const JenisBarang = sequelize.define("jenis_barang", {
  jenis_barang_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },  // dont forget to change to snake_case
  jenis_barang: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  // TODO: add more columns  
  // TODO: add relation to another table  
});

module.exports = JenisBarang;  
