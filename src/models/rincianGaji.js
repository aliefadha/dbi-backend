const { DataTypes } = require("sequelize");  
const sequelize = require("../config/database");  
const BayarGaji = require("./bayarGaji");
const Karyawan = require("./karyawan");
  
const RincianGaji = sequelize.define("rincian_gaji", {  
  rincian_gaji_id: {  
    type: DataTypes.INTEGER,  
    allowNull: false,
    primaryKey: true,
    autoIncrement: true,
  }, 
  bayar_gaji_id: {
    type: DataTypes.STRING,
    allowNull: false,
    references: {
      model: BayarGaji,
      key: 'bayar_gaji_id'
    }
  },
  karyawan_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Karyawan,
      key: 'karyawan_id'
    }
  },
  absen: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  kpi: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  potongan_gaji: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  total_gaji_akhir: {
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
  
module.exports = RincianGaji;  
