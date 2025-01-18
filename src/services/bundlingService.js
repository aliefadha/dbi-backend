const { sequelize, BundlingRincianBiaya, BundlingPackagingPerBarang } = require("../models");
const Addons = require("../models/addons");
const Bundling = require("../models/bundling");
const Cabang = require("../models/cabang");

class BundlingService {
  static async create(data) {
    return await Bundling.create(data);
  }

  static async getAll() {
    return await Bundling.findAll({
      where: {
        is_deleted: false
      },
      include: [
        {
          model: Cabang,
          as: 'cabang',
          attributes: ['cabang_id', 'nama_cabang']
        },
        {
          model: Addons,
          as: 'addons',
          attributes: ["addons_id", "jenis_addons", "nama_addons", "kuantitas", "harga_satuan", "total_biaya", "packaging_id"],
          where: { is_deleted: false }
        }
      ],
    });
  }

  static async getById(id) {
    return await Bundling.findByPk(id);
  }

  static async update(id, data) {
    const bundling = await Bundling.findByPk(id);
    if (!bundling) return null;

    Object.assign(bundling, data);
    await bundling.save();

    return bundling;
  }

  static async delete(id) {
    const bundling = await Bundling.findByPk(id);
    await bundling.update({ is_deleted: true });
    return true;
  }
}

module.exports = BundlingService;  
