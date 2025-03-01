const { sequelize } = require("../models");
const BayarGaji = require("../models/bayarGaji");  
const Cabang = require("../models/cabang");
const DivisiKaryawan = require("../models/divisiKaryawan");
const Karyawan = require("../models/karyawan");
const KategoriPengeluaran = require("../models/kategoriPengeluaran");
const MetodePembayaran = require("../models/metodePembayaran");
const RincianGaji = require("../models/rincianGaji");
const Toko = require("../models/toko");
const RincianGajiService = require("./rincianGajiService");
const { Op } = require("sequelize");
  
class BayarGajiService {  
  static async create(data) {  
    const transaction = await sequelize.transaction();
    
    try {
      const bayargaji = await BayarGaji.create(data, { transaction });
      const rincianGaji = data.rincian_gaji.map(item => ({
        ...item,
        bayar_gaji_id: bayargaji.bayar_gaji_id
      }));

      await RincianGajiService.create(rincianGaji, { transaction });

      await transaction.commit();
      return bayargaji;
    } catch (error) {
      await transaction.rollback();
      throw error;
    }  
  }  
  
  static async getAll(bulan, tahun) {
    const startDate = new Date(tahun, bulan-1, 1);
    const endDate = new Date(tahun, bulan, 0);
    endDate.setHours(23, 59, 59, 999);
    const whereConditions = {
      is_deleted: false,
      tanggal: {
        [Op.between]: [startDate, endDate]
      }
    };

    const data = await BayarGaji.findAll({
      where: whereConditions,
      attributes: {
        exclude: ["is_deleted"]
      },
      include: [
        {
          model: KategoriPengeluaran,
          as: "kategori_pengeluaran",
          attributes: ["kategori_pengeluaran"]
        },
        {
          model: MetodePembayaran,
          as: "metode",
          attributes: ["nama_metode"]
        },
        {
          model: RincianGaji,
          as: "rincian_gaji",
          include: [
            {
              model: Karyawan,
              as: "karyawan",
              attributes: ["karyawan_id", "nama_karyawan"],
              include: [
                {
                  model: DivisiKaryawan,
                  as: "divisi",
                  attributes: ["divisi_karyawan_id", "nama_divisi"]
                },
                {
                  model: Toko,
                  as: "toko",
                  attributes: ["toko_id", "nama_toko"]
                },
                {
                  model: Cabang,
                  as: "cabang",
                  attributes: ["cabang_id", "nama_cabang"]
                }
              ]
            }
          ]
        }
      ],
      order: [
        ['tanggal', 'DESC']
      ]
    });
  
    return data;
  }  
  
  static async getById(id) {  
    const bayarGajiData = await BayarGaji.findOne({
      where: {
        bayar_gaji_id: id,
        is_deleted: false
      },
      attributes: {
        exclude: ["is_deleted"]
      },
      include: [
        {
          model: KategoriPengeluaran,
          as: "kategori_pengeluaran",
          attributes: ["kategori_pengeluaran"]
        },
        {
          model: MetodePembayaran,
          as: "metode",
          attributes: ["nama_metode"]
        },
        {
          model: RincianGaji,
          as: "rincian_gaji",
          include: [
            {
              model: Karyawan,
              as: "karyawan",
              attributes: ["karyawan_id", "nama_karyawan"],
              include: [
                {
                  model: DivisiKaryawan,
                  as: "divisi",
                  attributes: ["divisi_karyawan_id", "nama_divisi"]
                },
                {
                  model: Toko,
                  as: "toko",
                  attributes: ["toko_id", "nama_toko"]
                },
                {
                  model: Cabang,
                  as: "cabang",
                  attributes: ["cabang_id", "nama_cabang"]
                }
              ]
            }
          ]
        }
      ]
    });  

    return bayarGajiData;
  }  
  
  static async update(id, data) {  
    const transaction = await sequelize.transaction();

    try {
      const bayarGaji = await BayarGaji.findOne({
        where: {
          bayar_gaji_id: id,
          is_deleted: false
        }
      });

      if (!bayarGaji) return null;
      await bayarGaji.update(data, { transaction });

      if (data.rincian_gaji && Array.isArray(data.rincian_gaji)) {

        const rincianGajiData = data.rincian_gaji.map(item => ({
          ...item,
          bayar_gaji_id: id
        }));

        await RincianGajiService.update(rincianGajiData, { transaction });
      }

      await transaction.commit();
      return await this.getById(id);
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }  
  
  static async delete(id) {  
    const bayarGaji = await BayarGaji.findByPk(id);  
    if (!bayarGaji) return null;  
    await bayarGaji.update({ is_deleted: true });  
    return true;  
  }  
}  
  
module.exports = BayarGajiService;  
