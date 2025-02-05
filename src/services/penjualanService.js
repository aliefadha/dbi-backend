const { sequelize } = require("../models");
const BarangCustom = require("../models/barangCustom");
const BarangHandmade = require("../models/barangHandmade");
const BarangNonHandmade = require("../models/barangNonHandmade");
const JenisBarang = require("../models/jenisBarang");
const KategoriBarang = require("../models/kategoriBarang");
const MetodePembayaran = require("../models/metodePembayaran");
const Packaging = require("../models/packaging");
const Penjualan = require("../models/penjualan");  
const ProdukPenjualan = require("../models/produkPenjualan");
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
      },
      include: [
        {
          model: MetodePembayaran,
          as: "metode_pembayaran",
          attributes: ["metode_id", "nama_metode"]
        }, 
        {
          model: ProdukPenjualan,
          as: "produk_penjualan",
          include: [
            {
              model: BarangHandmade,
              as: "barang_handmade",
              include: [
                {
                  model: KategoriBarang,
                  as: "kategori_barang",
                  attributes: ["nama_kategori_barang"]
                },
                {
                  model: JenisBarang,
                  as: "jenis_barang",
                  attributes: ["nama_jenis_barang"]
                }
              ]
            },
            {
              model: BarangNonHandmade,
              as: "barang_non_handmade",
              include: [
                {
                  model: KategoriBarang,
                  as: "kategori",
                  attributes: ["nama_kategori_barang"]
                },
                {
                  model: JenisBarang,
                  as: "jenis",
                  attributes: ["nama_jenis_barang"]
                }
              ]
            },
            {
              model: Packaging,
              as: "packaging",
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
              include: [
                {
                  model: JenisBarang,
                  as: "jenis_barang"
                },
                {
                  model: KategoriBarang,
                  as: "kategori"
                }
              ]
            }
          ]
        }
      ]
    });  
  }  
  
  static async update(id, data) {  
    const transaction = await sequelize.transaction();

    try {
      const penjualan = await Penjualan.findOne({
        where: {
          penjualan_id: id,
          is_deleted: false
        }
      });

      if(!penjualan) return null;
      await penjualan.update(data, { transaction });

      if (data.produk && Array.isArray(data.produk)) {
        // Update or create new produk
        const produkData = data.produk.map(item => (
          {
            ...item,
            penjualan_id: id,
            cabang_id: penjualan.cabang_id  
          }
        ));
        await ProdukPenjualanService.updateMany(produkData, { transaction });
      }
      await transaction.commit();

      const updatePenjualan = await this.getById(id);
      return updatePenjualan;
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }  
  
  static async delete(id) {  
    const penjualan = await Penjualan.findByPk(id);  
    if (!penjualan) return null;  
    await penjualan.update({ is_deleted: true });  
    return true;  
  }  
}  
  
module.exports = PenjualanService;  
