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
          throw new Error(`Not enough stock for this product`);
        }

        // Decrease stock if there is enough
        await stokEntry.decrement('jumlah_stok', { by: kuantitas, transaction });
      }

      return createdProdukList;
    } catch (error) {
      throw new Error(`Produk Penjualan failed: ${error.message}`);
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
      const penjualanId = data[0]?.penjualan_id;
      if (!penjualanId) throw new Error("Missing pembelian_id");

      const existingProduks = await ProdukPenjualan.findAll({
        where: { penjualan_id: penjualanId },
        transaction
      });

      const existingProduksMap = new Map(
        existingProduks.map(produk => [produk.produk_penjualan_id, produk])
      );
      const updatedProdukList = new Set();
      const receivedIds = new Set();

      for (const produk of data) {
        const { produk_penjualan_id, cabang_id, kuantitas } = produk;

        const { fieldName, fieldValue } = getFieldAndValue(produk);
        if (!fieldName) continue;

        let difference = 0; 

        if (produk_penjualan_id && existingProduksMap.has(produk_penjualan_id)) {
          const existingProduk = existingProduksMap.get(produk_penjualan_id);
          difference = kuantitas - existingProduk.kuantitas;

          await existingProduk.update( produk, { transaction });
          updatedProdukList.add(existingProduk);
          receivedIds.add(produk_penjualan_id);
        } else {
          const newProduk = await ProdukPenjualan.create(produk, { transaction});
          updatedProdukList.add(newProduk.produk_penjualan_id);
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
          throw new Error(`Not enough stock for this product`);
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

      for (const existingProduk of existingProduks) {
        if (!receivedIds.has(existingProduk.produk_penjualan_id)) {
          const { fieldName, fieldValue } = getFieldAndValue(existingProduk);
          if (!fieldName) continue;

          let stokEntry = await StokBarang.findOne({
            where: { [fieldName]: fieldValue, cabang_id: existingProduk.cabang_id, is_deleted: false },
            transaction
          });

          if (stokEntry) {
            await stokEntry.increment('jumlah_stok', { by: existingProduk.kuantitas, transaction });
          }

          await existingProduk.destroy({ transaction });
        }
      }
      return Array.from(updatedProdukList);
    } catch (error) {
      throw new Error(`Update Produk Penjualan failed: ${error.message}`);
    }
  }
  
  static async delete(id) {  
    const produkPenjualan = await ProdukPenjualan.findByPk(id);  
    if (!produkPenjualan) return null;  
    await produkPenjualan.update({ is_deleted: true });  
    return true;  
  }  
}  

// Helper function to determine field name and value dynamically
function getFieldAndValue(produk) {
  if (produk.packaging_id) return { fieldName: "packaging_id", fieldValue: produk.packaging_id };
  if (produk.barang_custom_id) return { fieldName: "barang_custom_id", fieldValue: produk.barang_custom_id };
  if (produk.barang_non_handmade_id) return { fieldName: "barang_non_handmade_id", fieldValue: produk.barang_non_handmade_id };
  if (produk.barang_handmade_id) return { fieldName: "barang_handmade_id", fieldValue: produk.barang_handmade_id };
  return { fieldName: null, fieldValue: null };
}
module.exports = ProdukPenjualanService;  
