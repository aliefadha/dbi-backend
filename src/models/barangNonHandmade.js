const { DataTypes } = require("sequelize");  
const sequelize = require("../config/database");  
const KategoriBarang = require("./kategoriBarang");
const JenisBarang = require("./jenisBarang");
  
const BarangNonHandmade = sequelize.define("barang_non_handmade", {  
  barang_non_handmade_id: {  
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
        model: KategoriBarang,
        key: "kategori_barang_id",
    }
  },
  jenis_barang_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 2,
    references: {
        model: JenisBarang,
        key: "jenis_barang_id",
    }
  },
  nama_barang: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  jumlah_minimum_stok: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  is_deleted: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  }
},{
  timestamps: false
});  
  
module.exports = BarangNonHandmade;  
