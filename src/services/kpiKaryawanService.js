const KpiKaryawan = require("../models/kpiKaryawan");  
  
class KpiKaryawanService {  
  static async create(data) {  
    return await KpiKaryawan.create(data);  
  }  
  
  static async getAll() {  
    return await KpiKaryawan.findAll();  
  }  
  
  static async getById(id) {  
    return await KpiKaryawan.findByPk(id);  
  }  
  
  static async update(id, data) {  
    const kpiKaryawan = await KpiKaryawan.findByPk(id);  
    if (!kpiKaryawan) return null;  
  
    Object.assign(kpiKaryawan, data);  
    await kpiKaryawan.save();  
  
    return kpiKaryawan;  
  }  
  
  static async delete(id) {  
    const kpiKaryawan = await KpiKaryawan.findByPk(id);  
    if (!kpiKaryawan) return null;  
    await kpiKaryawan.destroy();  
    return true;  
  }  
}  
  
module.exports = KpiKaryawanService;  
