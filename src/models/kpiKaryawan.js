const { DataTypes } = require("sequelize");  
const sequelize = require("../config/database");  
const Kpi = require("./kpi");
const Karyawan = require("./karyawan");
  
const KpiKaryawan = sequelize.define("kpi_karyawan", {  
  kpi_karyawan_id: {  
    type: DataTypes.INTEGER,  
    allowNull: false,
    primaryKey: true,
    autoIncrement: true,
  }, 
  kpi_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
          model: Kpi,
          key: "kpi_id",
      },
  },
  karyawan_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
          model: Karyawan,
          key: "karyawan_id",
      },
  },
  point_ke: {
      type: DataTypes.INTEGER,
      allowNull: true,
  },
});  
  
module.exports = KpiKaryawan;  
