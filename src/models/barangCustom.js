const { DataTypes } = require("sequelize");  
const sequelize = require("../config/database");  
const JenisBarang = require("./jenisBarang");
const KategoriBarang = require("./kategoriBarang");
const Toko = require("./toko");
  
const BarangCustom = sequelize.define("barang_custom", {  
  barang_custom_id: {  
    type: DataTypes.STRING,  
    allowNull: false,
    primaryKey: true,
  },
  toko_id: {
    type: DataTypes.INTEGER,
    references: {
      model: Toko,
      key: 'toko_id'
    }
  },
  image: {
    type: DataTypes.STRING,  
  },
  jenis_barang_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: JenisBarang,
      defaultValue: 3,
      key: 'jenis_barang_id'
    }
  },
  kategori_barang_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: KategoriBarang,
      key: 'kategori_barang_id'
    }
  },
  nama_barang: {
    type: DataTypes.STRING,
  },
  jumlah_minimum_stok: {
    type: DataTypes.INTEGER,
  },
  harga: {
    type: DataTypes.INTEGER,
  },
  isi: {
    type: DataTypes.INTEGER
  },
  harga_satuan: {
    type: DataTypes.INTEGER,
  },
  harga_jual: {
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
  
module.exports = BarangCustom;  
