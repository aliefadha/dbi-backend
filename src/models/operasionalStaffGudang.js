const { DataTypes } = require("sequelize");  
const sequelize = require("../config/database");  
  
const OperasionalStaffGudang = sequelize.define("operasional_staff_gudang", {  
  operasional_staff_id: {  
    type: DataTypes.INTEGER,  
    allowNull: false,
    primaryKey: true,
    autoIncrement: true,
  },
  nama_tabel: {
    type: DataTypes.STRING,
    defaultValue: "Biaya Operasional dan Staff"
  },
  total: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  rata_rata: {
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
  timestamps: false
});  
  
module.exports = OperasionalStaffGudang;  
