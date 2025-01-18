const Addons = require("../models/addons");

class AddonsService {
  static async create(data) {
    return await Addons.create(data);
  }

  static async createRincian(data) {
    return await Addons.create({
      ...data,
      jenis_addons: 'Rincian Biaya'
    })
  }

  static async createPackaging(data) {
    return await Addons.create({
      ...data,
      jenis_addons: 'Packaging'
    })
  }

  static async getAll() {
    return await Addons.findAll({
      where: { is_deleted: false }
    });
  }

  static async getAllRincian() {
    return await Addons.findAll({
      where: {
        is_deleted: false,
        jenis_addons: "Rincian Biaya"
      }
    });
  }

  static async getAllPackaging() {
    return await Addons.findAll({
      where: {
        is_deleted: false,
        jenis_addons: "Packaging"
      }
    });
  }

  static async getById(id) {
    return await Addons.findOne({
      where: {
        addons_id: id,
        is_deleted: false
      }
    });
  }

  static async update(id, data) {
    const addons = await Addons.findByPk(id);
    if (!addons) return null;

    Object.assign(addons, data);
    await addons.save();

    return addons;
  }

  static async delete(id) {
    const addons = await Addons.findByPk(id);
    if (!addons) return null;
    await addons.update({ is_deleted: true });
    return true;
  }
}

module.exports = AddonsService;  
