const { DataTypes } = require("sequelize");  
const sequelize = require("../config/database"); 
const Karyawan = require("./karyawan"); 
  
const CutiKaryawan = sequelize.define("cuti_karyawan", {  
  cuti_karyawan_id: {  
    type: DataTypes.INTEGER,  
    allowNull: false,
    primaryKey: true,
    autoIncrement: true,
  }, 
  karyawan_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
          model: Karyawan,
          key: "karyawan_id",
      },
  },
  tanggal_mulai: {
      type: DataTypes.DATE,
      allowNull: false,
  },
  tanggal_selesai: {
      type: DataTypes.DATE,
      allowNull: false,
  },
  alasan: {
      type: DataTypes.STRING,
      allowNull: false,
  },
  status: {
      type: DataTypes.STRING,
      allowNull: true,
  },
},{
    timestamps: false,
});  
  
module.exports = CutiKaryawan;  
