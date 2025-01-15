const JenisBarang = require("../models/jenisBarang");

class JenisBarangService {
  static async create(data) {
    return await JenisBarang.create(data);
  }

  static async getAll() {
    return await JenisBarang.findAll();
  }

  static async getById(id) {
    return await JenisBarang.findByPk(id);
  }

  static async update(id, data) {
    const jenisBarang = await JenisBarang.findByPk(id);
    if (!jenisBarang) return null;

    Object.assign(jenisBarang, data);
    await jenisBarang.save();

    return jenisBarang;
  }

  static async delete(id) {
    const jenisBarang = await JenisBarang.findByPk(id);
    if (!jenisBarang) return null;
    await jenisBarang.destroy();
    return true;
  }
}

module.exports = JenisBarangService;  
