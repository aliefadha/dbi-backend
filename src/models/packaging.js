const { DataTypes } = require("sequelize");  
const sequelize = require("../config/database");  
const JenisBarang = require("./jenisBarang");
const KategoriBarang = require("./kategoriBarang");
const Toko = require("./toko");
  
const Packaging = sequelize.define("packaging", {  
  packaging_id: {  
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
  jenis_barang_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
        model: JenisBarang,
        defaultValue: 4,
        key: "jenis_barang_id",
    }
  }, 
  kategori_barang_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
        model: KategoriBarang,
        key: "kategori_barang_id",
    }
  },
  image: {
    type: DataTypes.STRING
  },
  nama_packaging: {
    type: DataTypes.STRING,
    allowNull: false
  },
  ukuran: {
    type: DataTypes.STRING,
  },
  jumlah_minimum_stok: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  harga: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  isi: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  harga_satuan: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  is_deleted: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  }
},{
  timestamps: false
});  
  
module.exports = Packaging;  
