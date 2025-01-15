const { DataTypes } = require("sequelize");  
const sequelize = require("../config/database");
const DivisiKaryawan = require("./divisiKaryawan");
  
const Kpi = sequelize.define("kpi", {  
    kpi_id: {  
        type: DataTypes.INTEGER,  
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
    },  
    divisi_karyawan_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: DivisiKaryawan,
            key: "divisi_karyawan_id",
        },
    },
    nama_kpi: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    persentase: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    waktu: {
        type: DataTypes.STRING,
        allowNull: false,
    } 
}, {  
    timestamps: false,
});  
  
module.exports = Kpi;  
