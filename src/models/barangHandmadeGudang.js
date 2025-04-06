const { DataTypes } = require("sequelize");  
const sequelize = require("../config/database");  
const JenisBarangGudang = require("./jenisBarangGudang");
const KategoriBarangGudang = require("./kategoriBarangGudang");
  
const BarangHandmadeGudang = sequelize.define("barang_handmade_gudang", {  
  barang_handmade_id: {  
    type: DataTypes.STRING,  
    allowNull: false,
    primaryKey: true,
  }, 
  image: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  kategori_barang_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
        model: KategoriBarangGudang,
        key: "kategori_barang_id",
    }
  },
  jenis_barang_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 1,
    references: {
        model: JenisBarangGudang,
        key: "jenis_barang_id",
    }
  },
  nama_barang: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  waktu_pengerjaan: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
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
},{
  timestamps: true
});  
  
module.exports = BarangHandmadeGudang;  
