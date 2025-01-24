const { DataTypes } = require("sequelize");  
const sequelize = require("../config/database");  
const BarangHandmade = require("./barangHandmade");
  
const RincianBiayaHandmade = sequelize.define("rincian_biaya_handmade", {  
  rincian_biaya_handmade_id: {  
    type: DataTypes.INTEGER,  
    allowNull: false,
    primaryKey: true,
    autoIncrement: true,
  }, 
  barang_handmade_id: {
    type: DataTypes.STRING,
    allowNull: false,
    references: {
        model: BarangHandmade,
        key: "barang_handmade_id",
    }
  },
  nama_biaya: {
    type: DataTypes.STRING,
    allowNull: false
  },
  jumlah_biaya: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  is_deleted: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  }
},{
  timestamps: false
});  
  
module.exports = RincianBiayaHandmade;  
