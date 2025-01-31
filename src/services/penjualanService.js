const { sequelize } = require("../models");
const Penjualan = require("../models/penjualan");  
const ProdukPenjualanService = require("./produkPenjualanService");
  
class PenjualanService {  
  static async create(data) {  
    const transaction = await sequelize.transaction();
    try {
      const penjualan = await Penjualan.create(data, { transaction });
      const produkPenjualan = data.produk.map(item => ({
        ...item,
        penjualan_id: penjualan.penjualan_id,
        cabang_id: penjualan.cabang_id
      }));

      await ProdukPenjualanService.createMany(produkPenjualan, { transaction });

      await transaction.commit();
      return penjualan;
    } catch (error) {
      await transaction.rollback();
      throw error;
    }    
  }  
  
  static async getAll() {  
    return await Penjualan.findAll({
      where: {
        is_deleted: false
      }
    });  
  }  
  
  static async getById(id) {  
    return await Penjualan.findOne({
      where: {
        penjualan_id: id,
        is_deleted: false
      }
    });  
  }  
  
  static async update(id, data) {  
    const penjualan = await Penjualan.findByPk(id);  
    if (!penjualan) return null;  
  
    Object.assign(penjualan, data);  
    await penjualan.save();  
  
    return penjualan;  
  }  
  
  static async delete(id) {  
    const penjualan = await Penjualan.findByPk(id);  
    if (!penjualan) return null;  
    await penjualan.update({ is_deleted: true });  
    return true;  
  }  
}  
  
module.exports = PenjualanService;  
