const Kpi = require("../models/kpi");  
const DivisiKaryawan = require("../models/divisiKaryawan");
const { sequelize } = require('../models');
  
class KpiService {  
  static async create(data) {  
    return await Kpi.bulkCreate(data);  
  }  
  
  static async getAll() {  
    return await Kpi.findAll();  
  }  
  
  static async getById(id) {  
    return await Kpi.findByPk(id);  
  }  
  
  static async update(id, data) {  
    const existingKpis = await Kpi.findAll({  
        where: { divisi_karyawan_id: id }  
    });  

    const existingKpiMap = {};  
    existingKpis.forEach(kpi => {  
        existingKpiMap[kpi.kpi_id] = kpi; 
    });  

    const updatedKpiIds = [];  

    for (const kpiData of data) {  
        if (existingKpiMap[kpiData.kpi_id]) {  
            Object.assign(existingKpiMap[kpiData.kpi_id], kpiData);  
            await existingKpiMap[kpiData.kpi_id].save();  
            updatedKpiIds.push(kpiData.kpi_id);  
        } else {  
            const newKpi = await Kpi.create(kpiData);  
            updatedKpiIds.push(newKpi.kpi_id); 
        }  
    }  

    for (const kpi of existingKpis) {  
        if (!updatedKpiIds.includes(kpi.kpi_id)) {  
            await kpi.destroy();  
        }  
    }

    return updatedKpiIds;  
  }  
  
  static async delete(id) {  
    return await Kpi.destroy({ where: { divisi_karyawan_id: id } });
  }  

  static async getKpiByDivisi() {
    const divisiKaryawanList = await DivisiKaryawan.findAll({
      include: [
        {
          model: Kpi,
          as: "kpi",
        },
      ],
    });

    const result = divisiKaryawanList.map(divisi => {
      return {
        divisi_karyawan_id: divisi.divisi_karyawan_id,
        nama_divisi: divisi.nama_divisi,
        kpi: divisi.kpi,
        kpi_count: divisi.kpi.length
      };
    });

    return result;
  }
}  
  
module.exports = KpiService;  
