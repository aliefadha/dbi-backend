const BarangNonHandmadeGudang = require("../models/barangNonHandmadeGudang");  
const KategoriBarangGudang = require("../models/kategoriBarangGudang");
const RincianBiayaGudang = require("../models/rincianBiayaGudang");
const sequelize = require("../config/database");
const CustomIdGenerateService = require("./customIdGenerateService");
const RincianBiayaGudangService = require("./rincianBiayaGudangService");
const BiayaGudang = require("../models/biayaGudang");
  
class BarangNonHandmadeGudangService {  
  static async create(data) {
    const transaction = await sequelize.transaction();
    
    try {
      const { 
        image, 
        barang_nonhandmade_id, 
        kategori_barang_id, 
        nama_barang, 
        jumlah_minimum_stok,
        total_hpp,
        keuntungan,
        harga_jual,
        rincian_biaya
      } = data;

      const barangNonHandmadeGudang = await BarangNonHandmadeGudang.create({
        image,
        barang_nonhandmade_id,
        kategori_barang_id,
        nama_barang,
        jumlah_minimum_stok,
        total_hpp,
        keuntungan,
        harga_jual
      }, { transaction });

      const biayaGudang = await BiayaGudang.findByPk(1, {
        attributes: ['total_biaya', 'total_modal'],
        where: { is_deleted: false },
      });

      if (!biayaGudang) {
        throw new Error('Biaya Gudang data not found');
      }

      const defaultRincianBiaya = [
        {
          barang_nonhandmade_id: barangNonHandmadeGudang.barang_nonhandmade_id,
          nama_biaya: "Biaya Operasional dan Staff",
          jumlah_biaya: biayaGudang.total_biaya
        },
        {
          barang_nonhandmade_id: barangNonHandmadeGudang.barang_nonhandmade_id,
          nama_biaya: "Biaya Operasional Produksi",
          jumlah_biaya: biayaGudang.total_modal
        }
      ];

      const allRincianBiaya = [
        ...defaultRincianBiaya,
        ...(Array.isArray(rincian_biaya) ? rincian_biaya : []).map(biaya => ({
          ...biaya,
          barang_nonhandmade_id: barangNonHandmadeGudang.barang_nonhandmade_id
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
        barang_nonhandmade: barangNonHandmadeGudang,
        rincian_biaya: createdRincianBiaya
      };
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  } 
  
  static async getAll() {  
    return await BarangNonHandmadeGudang.findAll({
      where: {
        is_deleted: false
      },
      attributes: {
        exclude: ["kategori_barang_id", "jenis_barang_id"]
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
      ],
      order: [["createdAt", "DESC"]]
    });  
  }  
  
  static async getById(id) {  
    return await BarangNonHandmadeGudang.findOne({
      where: {
        barang_nonhandmade_id: id,
        is_deleted: false,
      },
      attributes: {
        exclude: ["kategori_barang_id", "jenis_barang_id"]
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
  
  static async update(id, data) {
      const transaction = await sequelize.transaction();
      
      try {
        const { 
          image, 
          kategori_barang_id, 
          nama_barang, 
          jumlah_minimum_stok,
          rincian_biaya,
          ...otherData 
        } = data;
  
        const barangNonHandmadeGudang = await BarangNonHandmadeGudang.findOne({
          where: {
            barang_nonhandmade_id: id,
            is_deleted: false
          }
        });
  
        if (!barangNonHandmadeGudang) return null;
  
        await barangNonHandmadeGudang.update({
          image,
          kategori_barang_id,
          nama_barang,
          jumlah_minimum_stok,
          ...otherData
        }, { transaction });
  
        const biayaGudang = await BiayaGudang.findByPk(1, {
          attributes: ['total_biaya', 'total_modal'],
          where: { is_deleted: false },
        });
  
        if (!biayaGudang) {
          throw new Error('Biaya Gudang data not found');
        }
  
        await RincianBiayaGudangService.deleteByBarangNonhandmadeId(id, { transaction });
  
        const defaultRincianBiaya = [
          {
            barang_nonhandmade_id: id,
            nama_biaya: "Biaya Operasional dan Staff",
            jumlah_biaya: biayaGudang.total_biaya
          },
          {
            barang_nonhandmade_id: id,
            nama_biaya: "Biaya Operasional Produksi",
            jumlah_biaya: biayaGudang.total_modal
          }
        ];
  
        const allRincianBiaya = [
          ...defaultRincianBiaya,
          ...(rincian_biaya || []).map(biaya => ({
            ...biaya,
            barang_nonhandmade_id: id
          }))
        ];
  
        await RincianBiayaGudangService.createMany(allRincianBiaya, { transaction });
  
        await transaction.commit();
  
        const updatedBarangNonHandmadeGudang = await this.getById(id);
        return updatedBarangNonHandmadeGudang;
      } catch (error) {
        await transaction.rollback();
        throw error;
      }
    }
  
  static async delete(id) {  
    const barangNonHandmadeGudang = await BarangNonHandmadeGudang.findByPk(id);  
    if (!barangNonHandmadeGudang) return null;  
    await barangNonHandmadeGudang.destroy();  
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
