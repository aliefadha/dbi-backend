const Kpi = require("../models/kpi");  
const DivisiKaryawan = require("../models/divisiKaryawan");
const { sequelize } = require('../models');
  
class KpiService {  
  static async create(data) {  
    return await Kpi.create(data);  
  }  
  
  static async getAll() {  
    return await Kpi.findAll();  
  }  
  
  static async getById(id) {  
    return await Kpi.findByPk(id);  
  }  
  
  static async update(id, data) {  
    const kpi = await Kpi.findByPk(id);  
    if (!kpi) return null;  
  
    Object.assign(kpi, data);  
    await kpi.save();  
  
    return kpi;  
  }  
  
  static async delete(id) {  
    const kpi = await Kpi.findByPk(id);  
    if (!kpi) return null;  
    await kpi.destroy();  
    return true;  
  }  

  static async getKpiByDivisi() {
    return await Kpi.findAll({
      include: [
        {
          model: DivisiKaryawan,
          as: "divisi",
        },
      ],
    });
  }
}  
  
module.exports = KpiService;  