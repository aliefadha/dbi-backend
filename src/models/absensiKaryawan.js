const { DataTypes } = require("sequelize");  
const sequelize = require("../config/database"); 
const Karyawan = require("./karyawan"); 
  
const AbsensiKaryawan = sequelize.define("absensi_karyawan", {  
  absensi_karyawan_id: {  
    type: DataTypes.INTEGER,  
    allowNull: false,
    primaryKey: true,
    autoIncrement: true,
  }, 
  image: {  
    type: DataTypes.STRING,
    allowNull: true,  
  },
  karyawan_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
        model: Karyawan,
        key: "karyawan_id",
    },
},
  tanggal: {
      type: DataTypes.DATE,
      allowNull: false,
  },
  jam_masuk: {
      type: DataTypes.TIME,
      allowNull: true,
  },
  jam_keluar: {
      type: DataTypes.TIME,
      allowNull: true,
  },
  total_menit: {
      type: DataTypes.INTEGER,
      allowNull: true,
  },
  lokasi: {
      type: DataTypes.STRING,
      allowNull: true,
  },
  status: {
      type: DataTypes.STRING,
      allowNull: true,
  },
  gaji_pokok_perhari: {
      type: DataTypes.INTEGER,
      allowNull: true,
  }
});  
  
module.exports = AbsensiKaryawan;  
