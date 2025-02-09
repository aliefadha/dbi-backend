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
      throw new Error(`Failed to create produk Pembelian: ${error.message}`);
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
        const pembelianId = data[0]?.pembelian_id;
        if (!pembelianId) throw new Error("Missing pembelian_id");

        // Fetch existing products for the given pembelian_id
        const existingProduks = await ProdukPembelian.findAll({
            where: { pembelian_id: pembelianId },
            transaction
        });

        // Create a map for quick lookup
        const existingProduksMap = new Map(
            existingProduks.map(produk => [produk.produk_pembelian_id, produk])
        );

        const updatedProdukList = new Set();
        const receivedIds = new Set(); // Store IDs from the incoming data

        for (const produk of data) {
            const { produk_pembelian_id, cabang_id, kuantitas } = produk;

            const { fieldName, fieldValue } = getFieldAndValue(produk);
            if (!fieldName) continue; // Skip if no valid field is found

            let difference = 0;

            if (produk_pembelian_id && existingProduksMap.has(produk_pembelian_id)) {
                // 🔹 Update existing record
                const existingProduk = existingProduksMap.get(produk_pembelian_id);
                difference = kuantitas - existingProduk.kuantitas;

                await existingProduk.update(produk, { transaction });
                updatedProdukList.add(produk_pembelian_id);
                receivedIds.add(produk_pembelian_id);
            } else {
                // 🔹 Create new record
                const newProduk = await ProdukPembelian.create(produk, { transaction });
                updatedProdukList.add(newProduk.produk_pembelian_id);
                difference = kuantitas;
            }

            // 🔹 Update stock
            let stokEntry = await StokBarang.findOne({
                where: { [fieldName]: fieldValue, cabang_id, is_deleted: false },
                transaction
            });

            if (stokEntry) {
                await stokEntry.increment("jumlah_stok", { by: difference, transaction });
            } else {
                await StokBarang.create(
                    { cabang_id, [fieldName]: fieldValue, jumlah_stok: kuantitas },
                    { transaction }
                );
            }
        }

        // 🔹 Delete old records that are NOT in the received data
        for (const existingProduk of existingProduks) {
            if (!receivedIds.has(existingProduk.produk_pembelian_id)) {
                const { fieldName, fieldValue } = getFieldAndValue(existingProduk);
                if (!fieldName) continue;

                let stokEntry = await StokBarang.findOne({
                    where: { [fieldName]: fieldValue, cabang_id: existingProduk.cabang_id, is_deleted: false },
                    transaction
                });

                if (stokEntry) {
                    await stokEntry.decrement("jumlah_stok", {
                        by: existingProduk.kuantitas,
                        transaction
                    });
                }

                await existingProduk.destroy({ transaction });
            }
        }

        return Array.from(updatedProdukList);
    } catch (error) {
        throw new Error(`Failed to Updated produk Pembelian: ${error.message}`);
    }
}





  
  static async delete(id) {  
    const produkPembelian = await ProdukPembelian.findByPk(id);  
    if (!produkPembelian) return null;  
    await produkPembelian.update({ is_deleted: true });  
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
  
module.exports = ProdukPembelianService;  
