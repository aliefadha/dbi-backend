const { DataTypes } = require("sequelize");  
const sequelize = require("../config/database");  
const Packaging = require("./packaging");
const Barang = require("./barang");
const Bundling = require("./bundling");
  
const PackagingPerBarang = sequelize.define("packaging_per_barang", {  
  packaging_per_barang_id: {  
    type: DataTypes.INTEGER,  
    allowNull: false,
    primaryKey: true,
    autoIncrement: true,
  },
  packaging_id: {
    type: DataTypes.INTEGER,
    references: {
      model: Packaging,
      key: 'packaging_id'
    }
  },
  bundling_id: {  
    type: DataTypes.INTEGER,  
    references: {  
      model: Bundling,
      key: 'bundling_id',  
    },  
},  
  barang_id: {
    type: DataTypes.INTEGER,
    references: {
      model: Barang,
      key: 'barang_id'
    }
  },
  kuantitas: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  harga_satuan: {
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
},{
  tableName: 'packaging_per_barangs',
  timestamps: false
});  
  
module.exports = PackagingPerBarang;  
