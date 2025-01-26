const BarangMentah = require("../models/barangMentah");
const BarangNonHandmadeGudang = require("../models/barangNonHandmadeGudang");
const RincianBahanGudang = require("../models/rincianBahanGudang");  
  
class RincianBahanGudangService {  
  static async create(data) {  
    return await RincianBahanGudang.create(data);  
  }  

  static async createMany(data, options = {}) {
      return await RincianBahanGudang.bulkCreate(data, options);
  }
  
  static async getAll() {  
    return await RincianBahanGudang.findAll({
      where: {
        is_deleted: false
      },
    });  
  }  
  
  static async getById(id) {  
    return await RincianBahanGudang.findOne({
      where: {
        rincian_bahan_id: id,
        is_deleted: false
      },
      include: [
        {
          model: BarangNonHandmadeGudang,
          as: "barang_nonhandmade",
        },
        {
          model: BarangMentah,
          as: "barang_mentah",
          attributes: ["image", "nama_barang", "harga_satuan", "isi"]
        }
      ]
    });  
  }  
  
  static async update(id, data) {  
    const rincianBahanGudang = await RincianBahanGudang.findByPk(id);  
    if (!rincianBahanGudang) return null;  
  
    Object.assign(rincianBahanGudang, data);  
    await rincianBahanGudang.save();  
  
    return rincianBahanGudang;  
  }  
  
  static async delete(id) {  
    const rincianBahanGudang = await RincianBahanGudang.findByPk(id);  
    if (!rincianBahanGudang) return null;  
    await rincianBahanGudang.update({ is_deleted: true });  
    return true;  
  }  

  static async deleteByBarangId(barangHandmadeId, options = {}) {
    return await RincianBahanGudang.update(
      { is_deleted: true },
      {
        where: {
          barang_handmade_id: barangHandmadeId,
          is_deleted: false
        },
        ...options
      }
    );
  }
}  
  
module.exports = RincianBahanGudangService;
