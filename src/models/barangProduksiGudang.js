const { DataTypes } = require("sequelize");  
const sequelize = require("../config/database");  
const BarangHandmadeGudang = require("./barangHandmadeGudang");
const ProduksiGudang = require("./produksiGudang");
  
const BarangProduksiGudang = sequelize.define("barang_produksi_gudang", {  
  barang_produksi_gudang_id: {  
    type: DataTypes.INTEGER,  
    allowNull: false,
    primaryKey: true,
    autoIncrement: true,
  },
  produksi_gudang_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: ProduksiGudang,
      key: 'produksi_gudang_id'
    }
  },
  barang_handmade_id: {
    type: DataTypes.STRING,
    allowNull: false,
    references: {
      model: BarangHandmadeGudang,
      key: 'barang_handmade_id'
    }
  },
  jumlah: {
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
  
module.exports = BarangProduksiGudang;  
