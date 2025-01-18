const { DataTypes } = require("sequelize");  
const sequelize = require("../config/database");  
const Packaging = require("./packaging");
const Bundling = require("./bundling");
  
const Addons = sequelize.define("addons", {  
  addons_id: {  
    type: DataTypes.INTEGER,  
    allowNull: false,
    primaryKey: true,
    autoIncrement: true,
  }, 
  jenis_addons: {
    type: DataTypes.ENUM(['Rincian Biaya', 'Packaging']),
    allowNull: false,
  },
  nama_addons: {
    type: DataTypes.STRING
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
      key: 'bundling_id'
    },
    allowNull: false
  },
  is_deleted: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  }
},{
  timestamps: false
});  
  
module.exports = Addons;  
