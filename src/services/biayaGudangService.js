const BiayaGudang = require("../models/biayaGudang");
const BiayaOperasionalProduksiGudang = require("../models/biayaOperasionalProduksiGudang");
const BiayaOperasionalStaffGudang = require("../models/biayaOperasionalStaffGudang");

class BiayaGudangService {
  static async create(data) {
    const { biaya_staff, biaya_operasional, total, rata_rata, total_biaya, waktu_kerja, total_modal } = data;

    const biayaGudang = await BiayaGudang.create({
      total,
      rata_rata,
      total_biaya,
      waktu_kerja,
      total_modal
    });

    const operasionalPromises = biaya_operasional.map(item => {
      return BiayaOperasionalProduksiGudang.create({
        biaya_gudang_id: biayaGudang.biaya_gudang_id,
        nama_biaya: item.nama_biaya,
        total_biaya: item.jumlah_biaya
      });
    });

    const staffPromises = biaya_staff.map(item => {
      return BiayaOperasionalStaffGudang.create({
        biaya_gudang_id: biayaGudang.biaya_gudang_id,
        nama_biaya: item.nama_biaya,
        total_biaya: item.jumlah_biaya
      });
    });

    return Promise.all([...operasionalPromises, ...staffPromises]);
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

  static async update(id, data) {
    const biayaGudang = await BiayaGudang.findByPk(id);
    if (!biayaGudang) return null;

    const { biaya_staff, biaya_operasional, total, rata_rata, total_biaya, waktu_kerja, total_modal } = data;

    // Update main biaya gudang record
    Object.assign(biayaGudang, {
      total,
      rata_rata,
      total_biaya,
      waktu_kerja,
      total_modal
    });
    await biayaGudang.save();

    // Delete existing related records
    await BiayaOperasionalProduksiGudang.destroy({
      where: { biaya_gudang_id: id }
    });
    await BiayaOperasionalStaffGudang.destroy({
      where: { biaya_gudang_id: id }
    });

    // Create new operational records
    const operasionalPromises = biaya_operasional.map(item => {
      return BiayaOperasionalProduksiGudang.create({
        biaya_gudang_id: biayaGudang.biaya_gudang_id,
        nama_biaya: item.nama_biaya,
        total_biaya: item.jumlah_biaya
      });
    });

    // Create new staff records
    const staffPromises = biaya_staff.map(item => {
      return BiayaOperasionalStaffGudang.create({
        biaya_gudang_id: biayaGudang.biaya_gudang_id,
        nama_biaya: item.nama_biaya,
        total_biaya: item.jumlah_biaya
      });
    });

    await Promise.all([...operasionalPromises, ...staffPromises]);

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
