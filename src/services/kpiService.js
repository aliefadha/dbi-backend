const Kpi = require("../models/kpi");  
const DivisiKaryawan = require("../models/divisiKaryawan");
const { sequelize } = require('../models');
  
class KpiService {  
  static async create(data) {
    try {
        // Group by divisi_karyawan_id and check total persentase
        const groupedPersentase = data.reduce((acc, kpi) => {
            acc[kpi.divisi_karyawan_id] = (acc[kpi.divisi_karyawan_id] || 0) + kpi.persentase;
            return acc;
        }, {});

        // Validate persentase does not exceed 100
        for (const divisiId in groupedPersentase) {
            if (groupedPersentase[divisiId] > 100) {
                throw new Error(`Total persentase for divisi_karyawan_id ${divisiId} cannot exceed 100`);
            }
        }

        // Ensure UUID is assigned if required
        const dataWithUuid = data.map(kpi => ({
            ...kpi,
            uuid: kpi.uuid || crypto.randomUUID()
        }));

        return await Kpi.bulkCreate(dataWithUuid);
    } catch (error) {
        throw new Error(`Failed to create KPI: ${error.message}`);
    }
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
