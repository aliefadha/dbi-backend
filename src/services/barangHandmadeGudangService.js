const sequelize = require("../config/database");
const BarangHandmadeGudang = require("../models/barangHandmadeGudang");
const BarangMentah = require("../models/barangMentah");
const KategoriBarangGudang = require("../models/kategoriBarangGudang");
const RincianBahanGudang = require("../models/rincianBahanGudang");
const RincianBiayaGudang = require("../models/rincianBiayaGudang");
const RincianBahanGudangService = require("./rincianBahanGudangService");
const RincianBiayaGudangService = require("./rincianBiayaGudangService");
const BiayaGudang = require("../models/biayaGudang");
const StokBarangGudang = require("../models/stokBarangGudang");

class BarangHandmadeGudangService {
  static async create(data) {
    const transaction = await sequelize.transaction();

    try {
      const {
        image,
        barang_handmade_id,
        kategori_barang_id,
        nama_barang,
        jumlah_minimum_stok,
        total_hpp,
        keuntungan,
        harga_jual,
        waktu_pengerjaan,
        rincian_bahan
      } = data;

      const barangHandmadeGudang = await BarangHandmadeGudang.create({
        image,
        barang_handmade_id,
        kategori_barang_id,
        nama_barang,
        jumlah_minimum_stok,
        total_hpp,
        keuntungan,
        harga_jual,
        waktu_pengerjaan
      }, { transaction });

      const rincianBahanToCreate = rincian_bahan.map((bahan) => ({
        ...bahan,
        barang_handmade_id: barangHandmadeGudang.barang_handmade_id,
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
          barang_handmade_id: barangHandmadeGudang.barang_handmade_id,
          nama_biaya: "Biaya Operasional dan Staff",
          jumlah_biaya: biayaGudang.total_biaya
        },
        {
          barang_handmade_id: barangHandmadeGudang.barang_handmade_id,
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
        barang_handmade: barangHandmadeGudang,
        rincian_bahan: createdRincianBahan,
        rincian_biaya: createdRincianBiaya
      };
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
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
          model: StokBarangGudang,
          as: "stok_barang",
          attributes: ["jumlah_stok"]
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
              attributes: ["image", "nama_barang"]
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
      ],
      order: [['createdAt', 'DESC']]
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
          model: StokBarangGudang,
          as: "stok_barang",
          attributes: ["jumlah_stok"]
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
              attributes: ["image", "nama_barang"]
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
    const transaction = await sequelize.transaction();

    try {
      const {
        image,
        kategori_barang_id,
        nama_barang,
        jumlah_minimum_stok,
        rincian_bahan,
        ...otherData
      } = data;

      const barangHandmadeGudang = await BarangHandmadeGudang.findOne({
        where: {
          barang_handmade_id: id,
          is_deleted: false
        }
      });

      if (!barangHandmadeGudang) return null;

      await barangHandmadeGudang.update({
        image,
        kategori_barang_id,
        nama_barang,
        jumlah_minimum_stok,
        ...otherData
      }, { transaction });

      if (rincian_bahan && Array.isArray(rincian_bahan)) {
        await RincianBahanGudangService.deleteByBarangId(id, { transaction });

        const rincianBahanToCreate = rincian_bahan.map((bahan) => ({
          ...bahan,
          barang_handmade_id: id,
        }));

        await RincianBahanGudangService.createMany(rincianBahanToCreate, { transaction });
      }

      const biayaGudang = await BiayaGudang.findByPk(1, {
        attributes: ['total_biaya', 'total_modal'],
        where: { is_deleted: false },
      });

      if (!biayaGudang) {
        throw new Error('Biaya Gudang data not found');
      }

      await RincianBiayaGudangService.deleteByBarangId(id, { transaction });

      const defaultRincianBiaya = [
        {
          barang_handmade_id: id,
          nama_biaya: "Biaya Operasional dan Staff",
          jumlah_biaya: biayaGudang.total_biaya
        },
        {
          barang_handmade_id: id,
          nama_biaya: "Biaya Operasional Produksi",
          jumlah_biaya: biayaGudang.total_modal
        }
      ];

      await RincianBiayaGudangService.createMany(defaultRincianBiaya, { transaction });

      await transaction.commit();

      const updatedBarangHandmadeGudang = await this.getById(id);
      return updatedBarangHandmadeGudang;
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  static async delete(id) {
    const barangHandmadeGudang = await BarangHandmadeGudang.findByPk(id);
    if (!barangHandmadeGudang) return null;
    await barangHandmadeGudang.destroy();
    return true;
  }

  static async createWithDetails(barangData, rincianBahan) {
    const transaction = await sequelize.transaction();

    try {

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
