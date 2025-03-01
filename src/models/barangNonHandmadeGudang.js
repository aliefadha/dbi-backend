const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const KategoriBarangGudang = require("./kategoriBarangGudang");
const JenisBarangGudang = require("./jenisBarangGudang");

const BarangNonHandmadeGudang = sequelize.define("barang_non_handmade_gudang", {
  barang_nonhandmade_id: {
    type: DataTypes.STRING,
    allowNull: false,
    primaryKey: true,
  },
  image: {
    type: DataTypes.STRING,
  },
  nama_barang: {
    type: DataTypes.STRING,
    allowNull: false
  },
  kategori_barang_id: {
    type: DataTypes.INTEGER,
    references: {
      model: KategoriBarangGudang,
      key: 'kategori_barang_id'
    }
  },
  jenis_barang_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 2,
    references: {
        model: JenisBarangGudang,
        key: "jenis_barang_id",
    }
  },
  jumlah_minimum_stok: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  total_hpp: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  keuntungan: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  harga_jual: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  is_deleted: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  }
}, {
  timestamps: true
});

module.exports = BarangNonHandmadeGudang;  
