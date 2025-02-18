const TargetBulananKasir = require("../models/targetBulananKasir");  
const Cabang = require("../models/cabang");

class TargetBulananKasirService {  
  static async create(data) {  
    return await TargetBulananKasir.bulkCreate(data);  
  }  
  
  static async getAll(cabang) { 
    const whereConditions = {};
    if (cabang) {
      whereConditions.cabang_id = cabang;
    } 
    return await TargetBulananKasir.findAll({
      where: whereConditions,
      include: [
        {
          model: Cabang,
          as: "cabang",
          attributes: ["nama_cabang"],
        },
      ],
    });  
  }  
  
  static async getById(id) {  
    return await TargetBulananKasir.findOne({
      where: { target_bulanan_kasir_id: id },
      include: [
        {
          model: Cabang,
          as: "cabang",
        },
      ]});  
  }  
  
  static async update(id, data) {  
    const targetBulananKasir = await TargetBulananKasir.findByPk(id);  
    if (!targetBulananKasir) return null;  
  
    Object.assign(targetBulananKasir, data);  
    await targetBulananKasir.save();  
  
    return targetBulananKasir;  
  }  
  
  static async delete(id) {  
    const targetBulananKasir = await TargetBulananKasir.findByPk(id);  
    if (!targetBulananKasir) return null;  
    await targetBulananKasir.destroy();  
    return true;  
  }  

  static async getTargetByCabang(id) {
    return await TargetBulananKasir.findAll({
      where: { cabang_id: id },
      include: [
        {
          model: Cabang,
          as: "cabang",
        },
      ]
    })
  }
}  
  
module.exports = TargetBulananKasirService;  
