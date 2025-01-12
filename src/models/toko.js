const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Toko = sequelize.define("toko", {
  nama_toko: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  img_path: {
    type: DataTypes.STRING,
  },
  //TODO:  add more column
  //TODO: add relation to another table
});

module.exports = Toko;
