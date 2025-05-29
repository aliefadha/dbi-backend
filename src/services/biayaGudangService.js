const BiayaGudang = require("../models/biayaGudang");
const BiayaOperasionalProduksiGudang = require("../models/biayaOperasionalProduksiGudang");
const BiayaOperasionalStaffGudang = require("../models/biayaOperasionalStaffGudang");

class BiayaGudangService {
  static async create(data) {
    const { total, rata_rata, total_biaya, waktu_kerja, total_modal, persentase } = data;

    const biayaGudang = await BiayaGudang.create({
      total,
      rata_rata,
      total_biaya,
      waktu_kerja,
      total_modal, 
      persentase,
    });

    return biayaGudang;

  }

  static async getAll() {
    return await BiayaGudang.findOne({
      where: {
        biaya_gudang_id: 1,
        is_deleted: false
      },
      attributes: ["total", "rata_rata", "total_biaya", "waktu_kerja", "total_modal"],
      include: [
        {
          model: BiayaOperasionalProduksiGudang,
          as: 'biaya_operasional',
          attributes: ['nama_biaya', 'total_biaya']
        },
        {
          model: BiayaOperasionalStaffGudang,
          as: 'biaya_staff',
          attributes: ['nama_biaya', 'total_biaya']
        }
      ]
    });
  }

  static async getById(id) {
    return await BiayaGudang.findOne({
      where: {
        biaya_gudang_id: id,
        is_deleted: false
      },
    });
  }

  static async update(id, data) {
    const biayaGudang = await BiayaGudang.findByPk(id);
    if (!biayaGudang) return null;

    const { total, rata_rata, total_biaya, waktu_kerja, total_modal, persentase } = data;

    // Update main biaya gudang record
    Object.assign(biayaGudang, {
      total,
      rata_rata,
      total_biaya,
      waktu_kerja,
      total_modal,
      persentase,
    });
    await biayaGudang.save();

    return biayaGudang;
  }

  static async delete(id) {  
      const biayaGudang = await BiayaGudang.findByPk(id);  
      if (!biayaGudang) return null;  
  
      // Soft delete related records
      await BiayaOperasionalProduksiGudang.update(
        { is_deleted: true },
        { where: { biaya_gudang_id: id } }
      );
      await BiayaOperasionalStaffGudang.update(
        { is_deleted: true },
        { where: { biaya_gudang_id: id } }
      );
  
      // Soft delete main record
      await biayaGudang.update({ is_deleted: true });
      
      return true;  
    }
}

module.exports = BiayaGudangService;
