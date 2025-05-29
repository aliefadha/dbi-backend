const { DataTypes } = require("sequelize");  
const sequelize = require("../config/database");  
const RincianBiaya = require("./rincianBiaya");
const BiayaToko = require("./biayaToko");
  
const DetailRincianBiaya = sequelize.define("detail_rincian_biaya", {  
  detail_rincian_biaya_id: {  
    type: DataTypes.INTEGER,  
    allowNull: false,
    primaryKey: true,
    autoIncrement: true,
  }, 
  rincian_biaya_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
        model: RincianBiaya,
        key: "rincian_biaya_id",
    },
  },
  // biaya_toko_id: {
  //   type: DataTypes.INTEGER,
  //   allowNull: true,
  //   references: {
  //       model: BiayaToko,
  //       key: "biaya_toko_id",
  //   },
  // },
  nama_biaya: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  jumlah_biaya: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  is_deleted: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  }
},{
  timestamps: false
});  
  
module.exports = DetailRincianBiaya;  
