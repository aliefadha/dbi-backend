const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");


const KategoriBarang = sequelize.define("kategori_barang", {
  kategori_barang_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true,
    unique: true,
  },
  nama_kategori_barang: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  is_deleted: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  }
}, {
  timestamps: false,
});

module.exports = KategoriBarang;
