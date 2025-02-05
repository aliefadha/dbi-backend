const ProdukPenjualan = require("../models/produkPenjualan");  
const StokBarang = require("../models/stokBarang");
  
class ProdukPenjualanService {  
  static async create(data) {  
    return await ProdukPenjualan.create(data);  
  }  

  static async createMany(data, options = {}) {
    const transaction = options.transaction;

    try {
      const createdProdukList = await ProdukPenjualan.bulkCreate(data, {
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
            cabang_id: cabang_id,
            [fieldName]: fieldValue,
            is_deleted: false
          },
          transaction
        });
       
        if (!stokEntry || stokEntry.jumlah_stok < kuantitas) {
          throw new Error(`Not enough stock for product: ${fieldName} at cabang ${cabang_id}`);
        }

        // Decrease stock if there is enough
        await stokEntry.decrement('jumlah_stok', { by: kuantitas, transaction });
      }

      return createdProdukList;
    } catch (error) {
      throw new Error(`createMany failed: ${error.message}`);
    }
  }
  
  static async getAll() {  
    return await ProdukPenjualan.findAll({
      where: {
        is_deleted: false
      }
    });  
  }  
  
  static async getById(id) {  
    return await ProdukPenjualan.findOne({
      where: {
        produk_penjualan_id: id,
        is_deleted: false
      }
    });  
  }  
  
  static async update(id, data) {  
    const produkPenjualan = await ProdukPenjualan.findByPk(id);  
    if (!produkPenjualan) return null;  
  
    Object.assign(produkPenjualan, data);  
    await produkPenjualan.save();  
  
    return produkPenjualan;  
  }  

  static async updateMany(data, options = {}) {
    const transaction = options.transaction;

    try {
      const updatedProdukList = [];

      for (const produk of data) {
        const { produk_penjualan_id, cabang_id, packaging_id, barang_custom_id, barang_non_handmade_id, barang_handmade_id, kuantitas } = produk;

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

        let difference = 0; 

        if (produk_penjualan_id) {
          // 🔹 Update existing recor
          const existingProduk = await ProdukPenjualan.findOne({
            where: { produk_penjualan_id },
            transaction
          });

          if (existingProduk) {
            const oldKuantitas = existingProduk.kuantitas;
            const newKuantitas = kuantitas;
            difference = newKuantitas - oldKuantitas;

            await existingProduk.update( produk, { transaction });
            updatedProdukList.push(existingProduk);  
          } else {
            throw new Error(`Produk with ID ${produk_penjualan_id} not found.`);
          }
        } else {
          const newProduk = await ProdukPenjualan.create(produk, { transaction});
          updatedProdukList.push(newProduk);
          difference = kuantitas; 
        }

        // Update stock 
        let stokEntry = await StokBarang.findOne({
          where: {
            cabang_id: cabang_id,
            [fieldName]: fieldValue,
            is_deleted: false
          },
          transaction
        });

        if (stokEntry && stokEntry.jumlah_stok < difference) {
          throw new Error(`Not enough stock for product: ${fieldName} at cabang ${cabang_id}`);
        }

        if (stokEntry) {
          await stokEntry.decrement('jumlah_stok', { by: difference, transaction });
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
    const produkPenjualan = await ProdukPenjualan.findByPk(id);  
    if (!produkPenjualan) return null;  
    await produkPenjualan.update({ is_deleted: true });  
    return true;  
  }  
}  
  
module.exports = ProdukPenjualanService;  
