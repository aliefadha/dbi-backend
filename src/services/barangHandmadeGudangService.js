const sequelize = require("../config/database");
const CustomIdGenerateService = require("./customIdGenerateService");
const BarangHandmadeGudang = require("../models/barangHandmadeGudang");  
const BarangMentah = require("../models/barangMentah");   
const KategoriBarangGudang = require("../models/kategoriBarangGudang");
const RincianBahanGudang = require("../models/rincianBahanGudang");
const RincianBiayaGudang = require("../models/rincianBiayaGudang");
const RincianBahanGudangService = require("./rincianBahanGudangService");
const RincianBiayaGudangService = require("./rincianBiayaGudangService");
const BiayaGudang = require("../models/biayaGudang");
  
class BarangHandmadeGudangService {  
  static async create(data) {  
    return await BarangHandmadeGudang.create(data);  
  }  
  
  static async getAll() {
    return await BarangHandmadeGudang.findAll({
      where: {
        is_deleted: false
      },
      include: [
        {
          model: KategoriBarangGudang,
          as: 'kategori',
          where: {
            is_deleted: false
          },
          attributes: ["nama_kategori_barang"]
        },
        {
          model: RincianBahanGudang,
          as: 'rincian_bahan',
          where: {
            is_deleted: false
          },
          attributes: ["barang_mentah_id", "harga_satuan", "kuantitas", "total_biaya"],
          include: [
            {
              model: BarangMentah,
              as: 'barang_mentah',
              attributes: ["barang_mentah_id", "image", "nama_barang"]
            }
          ]
        },
        {
          model: RincianBiayaGudang,
          as: 'rincian_biaya',
          where: {
            is_deleted: false
          },
          attributes: ["nama_biaya", "jumlah_biaya"]
        }
      ]
    });  
  }  
  
  static async getById(id) {  
    return await BarangHandmadeGudang.findOne({
      where: {
        barang_handmade_id: id,
        is_deleted: false
      },
      include: [
        {
          model: KategoriBarangGudang,
          as: 'kategori',
          where: {
            is_deleted: false
          },
          attributes: ["nama_kategori_barang"]
        },
        {
          model: RincianBahanGudang,
          as: 'rincian_bahan',
          where: {
            is_deleted: false
          },
          attributes: ["barang_mentah_id", "harga_satuan", "kuantitas", "total_biaya"],
          include: [
            {
              model: BarangMentah,
              as: 'barang_mentah',
              attributes: ["barang_mentah_id", "image", "nama_barang"]
            }
          ]
        },
        {
          model: RincianBiayaGudang,
          as: 'rincian_biaya',
          where: {
            is_deleted: false
          },
          attributes: ["nama_biaya", "jumlah_biaya"]
        }
      ]
    });  
  }  
  
  static async update(id, data, options = {}) {  
    const { image, kategori_barang_gudang_id, nama_barang, jumlah_minimum_stok } = data;

    const barangHandmadeGudang = await BarangHandmadeGudang.findOne({
      where: {
        barang_handmade_id: id,
        is_deleted: false
      }
    });

    if (!barangHandmadeGudang) return null;

    await barangHandmadeGudang.update({
      image,
      kategori_barang_gudang_id,
      nama_barang,
      jumlah_minimum_stok
    }, options);

    return barangHandmadeGudang;
  }  
  
  static async delete(id) {  
    const barangHandmadeGudang = await BarangHandmadeGudang.findByPk(id);  
    if (!barangHandmadeGudang) return null;  
    await barangHandmadeGudang.update({ is_deleted: true });  
    return true;  
  }  

  static async createWithDetails(barangData, rincianBahan) {
    const transaction = await sequelize.transaction();

    try {
      const newId = await CustomIdGenerateService.generateBarangHandmadeGudangId();
      barangData.barang_handmade_id = newId;

      const barangHandmadeGudang = await BarangHandmadeGudang.create(barangData, { transaction });

      const rincianBahanToCreate = rincianBahan.map((bahan) => ({
        ...bahan,
        barang_handmade_id: newId,
      }));

      const createdRincianBahan = await RincianBahanGudangService.createMany(
        rincianBahanToCreate,
        { transaction }
      );

      const biayaGudang = await BiayaGudang.findByPk(1, {
            attributes: ['total_biaya', 'total_modal'],
            where: { is_deleted: false },
          });

          if (!biayaGudang) {
            throw new Error('Biaya Gudang data not found');
          }

          const defaultRincianBiaya = [
            {
              barang_handmade_id: newId,
              nama_biaya: "Biaya Operasional dan Staff",
              jumlah_biaya: biayaGudang.total_biaya
            },
            {
              barang_handmade_id: newId,
              nama_biaya: "Biaya Operasional Produksi",
              jumlah_biaya: biayaGudang.total_modal
            }
          ];
      
          const createdRincianBiaya = await RincianBiayaGudangService.createMany(
            defaultRincianBiaya,
            { transaction }
          );
      
          if (!createdRincianBiaya) {
            throw new Error('Failed to create rincian biaya');
          }

      await transaction.commit();

      return {
        barangHandmade: barangHandmadeGudang,
        rincian_bahan: createdRincianBahan,
        rincian_biaya: createdRincianBiaya
      };
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }
}

module.exports = BarangHandmadeGudangService;
