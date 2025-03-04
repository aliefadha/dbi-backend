const BarangCustom = require("../models/barangCustom");
const BarangHandmade = require("../models/barangHandmade");
const BarangNonHandmade = require("../models/barangNonHandmade");
const Cabang = require("../models/cabang");
const JenisBarang = require("../models/jenisBarang");
const KategoriBarang = require("../models/kategoriBarang");
const Packaging = require("../models/packaging");
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
      const toko_id = data[0].toko_id;
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
            toko_id: toko_id,
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
            toko_id: toko_id,
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

  static async getAllByPembelianId(pembelianId) {  
    const produk = await ProdukPembelian.findAll({
      where: {
        pembelian_id: pembelianId,
        is_deleted: false
      },
      attributes: {
        exclude: ["is_deleted","pembelian_id","cabang_id","barang_handmade_id","barang_non_handmade_id","packaging_id","barang_custom_id","produk_pembelian_id"]
      },
      include: [
        {
          model: Cabang,
          as: "cabang",
          attributes: ["nama_cabang"]
        },
        {
          model: BarangHandmade,
          as: "barang_handmade",
          attributes: ["image", "barang_handmade_id", "nama_barang", "jumlah_minimum_stok"],
          include: [
            {
              model: JenisBarang,
              as: "jenis_barang",
              attributes: ["nama_jenis_barang"]
            },
            {
              model: KategoriBarang,
              as: "kategori_barang",
              attributes: ["nama_kategori_barang"]
            }
          ]
        },
        {
          model: BarangNonHandmade,
          as: "barang_non_handmade",
          attributes: ["image", "barang_non_handmade_id", "nama_barang", "jumlah_minimum_stok"],
          include: [
            {
              model: JenisBarang,
              as: "jenis",
              attributes: ["nama_jenis_barang"]
            },
            {
              model: KategoriBarang,
              as: "kategori",
              attributes: ["nama_kategori_barang"]
            }
          ]
        },
        {
          model: Packaging,
          as: "packaging",
          attributes: ["image", "packaging_id", "nama_packaging", "ukuran", "harga_satuan", "harga_jual"],
          include: [
            {
              model: JenisBarang,
              as: "jenis_barang",
              attributes: ["nama_jenis_barang"]
            },
            {
              model: KategoriBarang,
              as: "kategori_barang",
              attributes: ["nama_kategori_barang"]
            }
          ]
        },
        {
          model: BarangCustom,
          as: "barang_custom",
          attributes: ["image", "barang_custom_id", "nama_barang", "harga_satuan", "jumlah_minimum_stok", "harga_jual"],
          include: [
            {
              model: JenisBarang,
              as: "jenis_barang",
              attributes: ["nama_jenis_barang"]
            },
            {
              model: KategoriBarang,
              as: "kategori",
              attributes: ["nama_kategori_barang"]
            }
          ]
        }
      ]
    });

    return produk;
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
        const toko_id = data[0].toko_id;
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
                    { toko_id, cabang_id, [fieldName]: fieldValue, jumlah_stok: kuantitas },
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
    const existingProduks = await ProdukPembelian.findAll({
        where: { pembelian_id: id }
    });

    // Delete produkPembelian and update stokBarang
    for (const existingProduk of existingProduks) {
        const { fieldName, fieldValue } = getFieldAndValue(existingProduk);
        if (!fieldName) continue;

        let stokEntry = await StokBarang.findOne({
            where: { [fieldName]: fieldValue, cabang_id: existingProduk.cabang_id, is_deleted: false }
        });

        if (stokEntry) {
            await stokEntry.decrement("jumlah_stok", {
                by: existingProduk.kuantitas,
            });
        }

        await existingProduk.destroy();
    }  
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
