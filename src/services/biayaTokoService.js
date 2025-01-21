const BiayaToko = require("../models/biayaToko");  
const BiayaStaff = require("../models/biayaStaff");
const BiayaOperasional = require("../models/biayaOperasional");
  
class BiayaTokoService {  
  static async create(data) {  
    // return await BiayaToko.create(data);
    const { cabang_id, biaya_operasional, biaya_staff, total, rata_rata, total_biaya } = data;

    const biayaToko = await BiayaToko.create({
      cabang_id,
      total,
      rata_rata,
      total_biaya
    });

    const operasionalPromises = biaya_operasional.map(item => {
      return BiayaOperasional.create({
        biaya_toko_id: biayaToko.biaya_toko_id,
        nama_biaya: item.nama_biaya,
        jumlah_biaya: item.jumlah_biaya
      });
    });

    const staffPromises = biaya_staff.map(item => {
      return BiayaStaff.create({
        biaya_toko_id: biayaToko.biaya_toko_id,
        nama_biaya: item.nama_biaya,
        jumlah_biaya: item.jumlah_biaya
      });
    });

    await Promise.all([...operasionalPromises, ...staffPromises]);

    return biayaToko;
  }  
  
  static async getAll() {  
    return await BiayaToko.findAll({
      where: {
        is_deleted: false
      },
      include: [
        {
          model: BiayaOperasional,
          as: "biaya_operasional",
        },
        {
          model: BiayaStaff,
          as: "biaya_staff",
        },
      ]
    });  
  }  
  
  static async getById(id) {  
    return await BiayaToko.findOne({
      where: {
        cabang_id: id,
        is_deleted: false
      },
      include: [
        {
          model: BiayaOperasional,
          as: "biaya_operasional",
        },
        {
          model: BiayaStaff,
          as: "biaya_staff",
        },
      ]
    });  
  }  
  
  static async update(id, data) {  
    const { biaya_operasional, biaya_staff, total, rata_rata, total_biaya } = data;
    const biayaToko = await BiayaToko.findOne({
      where: {
        cabang_id: id
      }
    });  
    if (!biayaToko) return null;  
    await biayaToko.update({
      total,
      rata_rata,
      total_biaya
    });

    // Update operational costs  
    await BiayaOperasional.destroy({ where: { biaya_toko_id: biayaToko.biaya_toko_id } }); // Clear existing records  
    const operasionalPromises = biaya_operasional.map(item => {  
      return BiayaOperasional.create({  
        biaya_toko_id: biayaToko.biaya_toko_id,  
        nama_biaya: item.nama_biaya,  
        jumlah_biaya: item.jumlah_biaya  
      });  
    });  
  
    // Update staff costs  
    await BiayaStaff.destroy({ where: { biaya_toko_id: biayaToko.biaya_toko_id } }); // Clear existing records  
    const staffPromises = biaya_staff.map(item => {  
      return BiayaStaff.create({  
        biaya_toko_id: biayaToko.biaya_toko_id,  
        nama_biaya: item.nama_biaya,  
        jumlah_biaya: item.jumlah_biaya  
      });  
    });  
  
    await Promise.all([...operasionalPromises, ...staffPromises]);  
  
    return biayaToko;  
  }  
  
  static async delete(id) {  
    const biayaToko = await BiayaToko.findByPk(id);  
    if (!biayaToko) return null;  
    await biayaToko.update({ is_deleted: true });  
    return true;  
  }  
}  
  
module.exports = BiayaTokoService;  
