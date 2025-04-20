const Kpi = require("../models/kpi");  
const DivisiKaryawan = require("../models/divisiKaryawan");
const { sequelize } = require('../models');
const { Op } = require("sequelize");
  
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
                throw new Error("Total persentase cannot exceed 100");
            }
        }

        // Ensure UUID is assigned if required
        const dataWithUuid = data.map(kpi => ({
            ...kpi,
            uuid: kpi.uuid
        }));

        return await Kpi.bulkCreate(dataWithUuid);
    } catch (error) {
        throw new Error("Failed to create KPI");
    }
}



  static async getAll(toko_id) {  
    const whereConditions = {
      is_deleted: false
    }
    if (toko_id) {
      whereConditions.toko_id = toko_id
    }
    return await Kpi.findAll({
      where: whereConditions,
      order: [['createdAt', 'DESC']]
    });  
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

  static async getKpiByDivisi(toko_id) {
    const whereConditions = {
      is_deleted: false
    }
    if (toko_id) {
      whereConditions.toko_id = toko_id
    }
    const divisiKaryawanList = await DivisiKaryawan.findAll({
      where: whereConditions,
      include: [
        {
          model: Kpi,
          as: "kpi",
        },
      ],
    });

    const result = divisiKaryawanList.map(divisi => {
      // Check if the divisi name is not "SPV" or "Head Gudang"
      if (divisi.nama_divisi !== "SPV" && divisi.nama_divisi !== "Head Gudang") {
        return {
          divisi_karyawan_id: divisi.divisi_karyawan_id,
          nama_divisi: divisi.nama_divisi,
          kpi: divisi.kpi,
          kpi_count: divisi.kpi ? divisi.kpi.length : 0
        };
      }
      // Return null for divisi names that should be hidden
      return null;
    }).filter(item => item !== null); 

    return result;
  }

  static async getDivisiKpi(toko_id) {
    const whereConditions = {
      is_deleted: false
    }
    if (toko_id) {
      whereConditions.toko_id = toko_id
    }
    const divisiKpi = await DivisiKaryawan.findAll({
        where: whereConditions,
        include: [
            {
                model: Kpi,
                as: "kpi",
                // Exclude Kpi associations with through: null (if applicable)
                through: null
            },
        ]
    });
    
    // Filter out entries with any Kpi data
    const result = divisiKpi.filter(entry => 
        (entry.kpi === undefined || entry.kpi.length === 0) &&
        !["Head Gudang", "SPV"].includes(entry.nama_divisi)
    );
      return result;
  }

  static async getManagerKpi() {
    const managerKpi =  await Kpi.findAll();
    
    const result = managerKpi.filter(entry => 
        entry.kpi_id === 1
    );
    return result;
  }

  static async getManagerKpiByDivisi() {
    const divisiKaryawanList = await DivisiKaryawan.findAll({
        where: {
            [Op.or]: [
                { toko_id: null },
                { nama_divisi: { [Op.in]: ["Manager", "Finance", "Head Gudang", "SPV"] } }
            ]
        },
        include: [
            {
                model: Kpi,
                as: "kpi",
            },
        ],
    });

    const result = divisiKaryawanList.map(divisi => ({
        divisi_karyawan_id: divisi.divisi_karyawan_id,
        nama_divisi: divisi.nama_divisi,
        kpi: divisi.kpi,
        kpi_count: divisi.kpi ? divisi.kpi.length : 0
    }));

    return result;
}


static async getManagerKpiList() {
  const divisiKpi = await DivisiKaryawan.findAll({
      where: {
          is_deleted: false,
          [Op.or]: [
              { toko_id: null },
              { nama_divisi: { [Op.in]: ["Manager", "Finance", "Head Gudang", "SPV"] } }
          ]
      },
      include: [
          {
              model: Kpi,
              as: "kpi",
              through: null
          },
      ]
  });

  // Filter: hanya ambil yang tidak memiliki Kpi
  return divisiKpi.filter(entry => !entry.kpi || entry.kpi.length === 0);
}


}  
  
module.exports = KpiService;  
