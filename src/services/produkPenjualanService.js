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

  // static async updateMany(data, options = {}) {
  //   const transaction = await sequelize.transaction();

  //   try {
  //     for (const updatedProduk of data) {
  //       const { produk_penjualan_id, cabang_id, packaging_id, barang_custom_id, barang_non_handmade_id, barang_handmade_id, kuantitas } = updatedProduk;

  //       let fieldName, fieldValue;
  //       if (packaging_id) {
  //         fieldName = 'packaging_id';
  //         fieldValue = packaging_id;
  //       } else if (barang_custom_id) {
  //         fieldName = 'barang_custom_id';
  //         fieldValue = barang_custom_id;
  //       } else if (barang_non_handmade_id) {
  //         fieldName = 'barang_non_handmade_id';
  //         fieldValue = barang_non_handmade_id;
  //       } else if (barang_handmade_id) {
  //         fieldName = 'barang_handmade_id';
  //         fieldValue = barang_handmade_id;
  //       } else {
  //         continue;
  //       }

  //       const existingProduk = await ProdukPenjualan.findOne({
  //         where: {
  //           produk_penjualan_id: produk_penjualan_id,
  //           is_deleted: false
  //         },
  //         transaction
  //       });
  //     }
  //   }
  
  static async delete(id) {  
    const produkPenjualan = await ProdukPenjualan.findByPk(id);  
    if (!produkPenjualan) return null;  
    await produkPenjualan.update({ is_deleted: true });  
    return true;  
  }  
}  
  
module.exports = ProdukPenjualanService;  
