const ProdukPembelian = require("../models/produkPembelian");  
const StokBarang = require("../models/stokBarang");

class ProdukPembelianService {  
  static async create(data) {  
    return await ProdukPembelian.create(data);  
  }  

  static async createMany(data, options = {}) {
    const transaction = options.transaction;

    try {
      const createdProdukList = await ProdukPembelian.bulkCreate(data, {
        transaction,
        returning: true,
      });

      for (const produk of createdProdukList) {
        const { cabang_id, packaging_id, barang_custom_id, barang_non_handmade_id, barang_handmade_id, kuantitas } = produk;

        let fieldName, fieldValue;
        if (packaging_id) {
          fieldName = 'packaging_id';
          fieldValue = packaging_id;
        } else if (barang_custom_id) {
          fieldName = 'barang_custom_id';
          fieldValue = barang_custom_id;
        } else if (barang_non_handmade_id) {
          fieldName = 'barang_non_handmade_id';
          fieldValue = barang_non_handmade_id;
        } else if (barang_handmade_id) {
          fieldName = 'barang_handmade_id';
          fieldValue = barang_handmade_id;
        } else {
          continue;
        }

        let stokEntry = await StokBarang.findOne({
          where: {
            [fieldName]: fieldValue,
            cabang_id: cabang_id,  
            is_deleted: false
          },
          transaction,
        });
  
        if (stokEntry) {
          await stokEntry.increment('jumlah_stok', {
            by: kuantitas,
            transaction,
          });
        } else {
          await StokBarang.create({
            cabang_id: cabang_id,  
            [fieldName]: fieldValue,
            jumlah_stok: kuantitas
          }, { transaction });
        }
      }
  
      return createdProdukList;
    } catch (error) {
      throw new Error(`createMany failed: ${error.message}`);
    }
  }
  
  static async getAll() {  
    return await ProdukPembelian.findAll({
      where: {
        is_deleted: false
      }
    });  
  }  
  
  static async getById(id) {  
    return await ProdukPembelian.findOne({
      where: {
        produk_pembelian_id: id,
        is_deleted: false
      }
    });  
  }  
  
  static async update(id, data) {  
    const produkPembelian = await ProdukPembelian.findByPk(id);  
    if (!produkPembelian) return null;  
  
    Object.assign(produkPembelian, data);  
    await produkPembelian.save();  
  
    return produkPembelian;  
  }  

  static async updateMany(data, options = {}) {
    const transaction = options.transaction;

    try {
      const updatedProdukList = await ProdukPembelian.bulkUpdate(data, {
        transaction,
        returning: true,
      });

      for (const produk of updatedProdukList) {
        const { cabang_id, packaging_id, barang_custom_id, barang_non_handmade_id, barang_handmade_id, kuantitas } = produk;

        let fieldName, fieldValue;
        if (packaging_id) {
          fieldName = 'packaging_id';
          fieldValue = packaging_id;
        } else if (barang_custom_id) {
          fieldName = 'barang_custom_id';
          fieldValue = barang_custom_id;  
        } else if (barang_non_handmade_id) {
          fieldName = 'barang_non_handmade_id';
          fieldValue = barang_non_handmade_id;
        } else if (barang_handmade_id) {
          fieldName = 'barang_handmade_id';
          fieldValue = barang_handmade_id;
        } else {
          continue;
        }

        let stokEntry = await StokBarang.findOne({
          where: {
            [fieldName]: fieldValue,
            cabang_id: cabang_id,  
            is_deleted: false
          },
          transaction,
        });
  
        if (stokEntry) {
          await stokEntry.increment('jumlah_stok', {
            by: kuantitas,
            transaction,
          });
        } else {
          await StokBarang.create({
            cabang_id: cabang_id,  
            [fieldName]: fieldValue,
            jumlah_stok: kuantitas
          }, { transaction });
        }
      }

      return updatedProdukList;
    } catch (error) {
      throw new Error(`updateMany failed: ${error.message}`);
        }
  }
  
  static async delete(id) {  
    const produkPembelian = await ProdukPembelian.findByPk(id);  
    if (!produkPembelian) return null;  
    await produkPembelian.update({ is_deleted: true });  
    return true;  
  }  
}  
  
module.exports = ProdukPembelianService;  
