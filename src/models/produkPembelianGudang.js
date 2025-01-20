const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const PembelianGudang = require("./pembelianGudang");
const BarangNonHandmadeGudang = require("./barangNonHandmadeGudang");
const BarangMentah = require("./barangMentah");
const PackagingGudang = require("./packagingGudang");

const ProdukPembelianGudang = sequelize.define("produk_pembelian_gudang", {
  produk_pembelian_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true,
  },
  pembelian_id: {
    type: DataTypes.INTEGER,
    references: {
      model: PembelianGudang,
      key: 'pembelian_id'
    }
  },
  barang_id: {
    type: DataTypes.INTEGER,
    references: {
      model: BarangNonHandmadeGudang,
      key: 'barang_id'
    }
  },
  barang_mentah_id: {
    type: DataTypes.INTEGER,
    references: {
      model: BarangMentah,
      key: 'barang_mentah_id'
    },
  },
  packaging_id: {
    type: DataTypes.INTEGER,
    references: {
      model: PackagingGudang,
      key: 'packaging_id'
    }
  },
  harga_satuan: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  kuantitas: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  total_biaya: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  is_deleted: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  }
}, {
  timestamps: false
});

module.exports = ProdukPembelianGudang;  
