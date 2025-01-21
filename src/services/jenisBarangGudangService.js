const BarangNonHandmadeGudang = require("../models/barangNonHandmadeGudang");
const JenisBarangGudang = require("../models/jenisBarangGudang");  
  
class JenisBarangGudangService {  
  static async create(data) {  
    return await JenisBarangGudang.create(data);  
  }  
  
  static async getAll() {  
    return await JenisBarangGudang.findAll({
      where: {
        is_deleted: false
      }
    });  
  }  
  
  static async getById(id) {  
    return await JenisBarangGudang.findOne({
      where: {
        jenis_barang_id: id,
        is_deleted: false
      },
      include: [
        {
          model: BarangNonHandmadeGudang,
          as: "barang"
        }
      ]
    });  
  }  
  
  static async update(id, data) {  
    const jenisBarangGudang = await JenisBarangGudang.findByPk(id);  
    if (!jenisBarangGudang) return null;  
  
    Object.assign(jenisBarangGudang, data);  
    await jenisBarangGudang.save();  
  
    return jenisBarangGudang;  
  }  
  
  static async delete(id) {  
    const jenisBarangGudang = await JenisBarangGudang.findByPk(id);  
    if (!jenisBarangGudang) return null;  
    await jenisBarangGudang.update({ is_deleted: true });  
    return true;  
  }  
}  
  
module.exports = JenisBarangGudangService;  
