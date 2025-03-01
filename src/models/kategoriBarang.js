const { DataTypes, Model } = require("sequelize");
const sequelize = require("../config/database");
const Toko = require("./toko");

const KategoriBarang = sequelize.define("kategori_barang", {
  kategori_barang_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true,
    unique: true,
  },
  toko_id: {
    type: DataTypes.INTEGER,
    references: {
      model: Toko,
      key: "toko_id"
    }
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
  timestamps: true,
});

module.exports = KategoriBarang;
