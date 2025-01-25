const BarangMentah = require("../models/barangMentah");
const BarangNonHandmadeGudang = require("../models/barangNonHandmadeGudang");  
const JenisBarangGudang = require("../models/jenisBarangGudang");
const KategoriBarangGudang = require("../models/kategoriBarangGudang");
const RincianBahanGudang = require("../models/rincianBahanGudang");
const RincianBiayaGudang = require("../models/rincianBiayaGudang");
const sequelize = require("../config/database");
const CustomIdGenerateService = require("./customIdGenerateService");
const RincianBiayaGudangService = require("./rincianBiayaGudangService");
const BiayaGudang = require("../models/biayaGudang");
  
class BarangNonHandmadeGudangService {  
  static async create(data) {  
    return await BarangNonHandmadeGudang.create(data);  
  }  
  
  static async getAll() {  
    return await BarangNonHandmadeGudang.findAll({
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
    return await BarangNonHandmadeGudang.findOne({
      where: {
        barang_nonhandmade_id: id,
        is_deleted: false,
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

    const barangNonHandmadeGudang = await BarangNonHandmadeGudang.findOne({
      where: {
        barang_nonhandmade_id: id,
        is_deleted: false
      }
    });

    if (!barangNonHandmadeGudang) return null;

    await barangNonHandmadeGudang.update({
      image,
      kategori_barang_gudang_id,
      nama_barang,
      jumlah_minimum_stok
    }, options);

    return barangNonHandmadeGudang;
  }
  
  static async delete(id) {  
    const barangNonHandmadeGudang = await BarangNonHandmadeGudang.findByPk(id);  
    if (!barangNonHandmadeGudang) return null;  
    await barangNonHandmadeGudang.update({ is_deleted: true });  
    return true;  
  }  
  
  static async createWithDetails(barangData, rincianBiaya = []) {
    const transaction = await sequelize.transaction();

    try {
      const newId = await CustomIdGenerateService.generateBarangNonHandmadeGudangId();
      barangData.barang_nonhandmade_id = newId;

      const barangNonHandmadeGudang = await BarangNonHandmadeGudang.create(barangData, { transaction });

      const biayaGudang = await BiayaGudang.findByPk(1, {
        attributes: ['total_biaya', 'total_modal'],
        where: { is_deleted: false },
      });

      if (!biayaGudang) {
        throw new Error('Biaya Gudang data not found');
      }

      const defaultRincianBiaya = [
        {
          barang_nonhandmade_id: newId,
          nama_biaya: "Biaya Operasional dan Staff",
          jumlah_biaya: biayaGudang.total_biaya
        },
        {
          barang_nonhandmade_id: newId,
          nama_biaya: "Biaya Operasional Produksi",
          jumlah_biaya: biayaGudang.total_modal
        }
      ];

      // Combine default rincian biaya with additional rincian biaya from request
      const allRincianBiaya = [
        ...defaultRincianBiaya,
        ...rincianBiaya.map(biaya => ({
          ...biaya,
          barang_nonhandmade_id: newId
        }))
      ];

      const createdRincianBiaya = await RincianBiayaGudangService.createMany(
        allRincianBiaya,
        { transaction }
      );

      if (!createdRincianBiaya) {
        throw new Error('Failed to create rincian biaya');
      }

      await transaction.commit();

      return {
        barangNonHandmade: barangNonHandmadeGudang,
        rincian_biaya: createdRincianBiaya
      };
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }
}  
  
module.exports = BarangNonHandmadeGudangService;
