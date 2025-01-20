const { DataTypes } = require("sequelize");  
const sequelize = require("../config/database");  
const BarangNonHandmadeGudang = require("./barangNonHandmadeGudang");
  
const BarangProduksiGudang = sequelize.define("barang_produksi_gudang", {  
  barang_produksi_gudang_id: {  
    type: DataTypes.INTEGER,  
    allowNull: false,
    primaryKey: true,
    autoIncrement: true,
  },
  barang_id: {
    type: DataTypes.INTEGER,
    references: {
      model: BarangNonHandmadeGudang,
      key: 'barang_id'
    }
  },
  jumlah: {
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
  
module.exports = BarangProduksiGudang;  
