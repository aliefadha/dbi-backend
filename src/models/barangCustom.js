const { DataTypes } = require("sequelize");  
const sequelize = require("../config/database");
const KategoriBarang = require("./kategoriBarang");
  
const BarangCustom = sequelize.define("barang_custom", {  
  barang_custom_id: {  
    type: DataTypes.INTEGER,  
    allowNull: false,
    primaryKey: true,
    autoIncrement: true,
  },
  image: {
    type: DataTypes.STRING,  
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
  kategori_barang_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: KategoriBarang,
      key: 'kategori_barang_id'
    }
  }
},{timestamps: false});
  
module.exports = BarangCustom;  
