const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const JenisBarang = require("./jenisBarang");
const KategoriBarang = require("./kategoriBarang");

const Barang = sequelize.define("barang", {
  barang_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true,
  },
  image: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  nama_barang: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  jumlah_minimum_stok: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  harga: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  isi: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  harga_satuan: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  jenis_barang_id: {
    type: DataTypes.INTEGER,
    references: {
      model: JenisBarang,
      key: 'jenis_barang_id'
    },
    allowNull: false,
  },
  kategori_barang_id: {
    type: DataTypes.INTEGER,
    references: {
      model: KategoriBarang,
      key: 'kategori_barang_id'
    },
    allowNull: false
  },
  is_deleted: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  }
}, {
  timestamps: false,
});

module.exports = Barang;  
