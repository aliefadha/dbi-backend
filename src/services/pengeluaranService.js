const { Op } = require("sequelize");
const { sequelize } = require("../models");
const Cabang = require("../models/cabang");
const DeskripsiPengeluaran = require("../models/deskripsiPengeluaran");
const KategoriPengeluaran = require("../models/kategoriPengeluaran");
const MetodePembayaran = require("../models/metodePembayaran");
const Pengeluaran = require("../models/pengeluaran");
const Toko = require("../models/toko");
const DeskripsiPengeluaranService = require("./deskripsiPengeluaranService");
const RincianGaji = require("../models/rincianGaji");
const Karyawan = require("../models/karyawan");
const BayarGaji = require("../models/bayarGaji");

class PengeluaranService {
  static async create(data) {
    const transaction = await sequelize.transaction();
    try {
      const pengeluaran = await Pengeluaran.create(data, { transaction });
      const DeskripsiPengeluaran = data.deskripsi_pengeluaran.map(item => ({
        ...item,
        pengeluaran_id: pengeluaran.pengeluaran_id
      }));

      await DeskripsiPengeluaranService.create(DeskripsiPengeluaran, { transaction });

      await transaction.commit();
      return pengeluaran;
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  static async getAll(start_date = null, end_date = null) {
    const whereClause = {
      is_deleted: false
    };

    // Add date range filter if dates are provided
    if (start_date && end_date) {
      whereClause.tanggal = {
        [Op.between]: [start_date, end_date]
      };
    }

    const pengeluarans = await Pengeluaran.findAll({
      where: whereClause,
      attributes: {
        exclude: ['is_deleted', 'metode_id', 'kategori_pengeluaran_id']
      },
      include: [
        {
          model: KategoriPengeluaran,
          as: 'kategori_pengeluaran',
          attributes: ['kategori_pengeluaran']
        },
        {
          model: MetodePembayaran,
          as: 'metode',
          attributes: ['nama_metode']
        },
        {
          model: DeskripsiPengeluaran,
          as: 'deskripsi_pengeluaran',
          attributes: ['deskripsi_pengeluaran_id', 'deskripsi', 'jumlah_pengeluaran'],
          include: [
            {
              model: Toko,
              as: 'toko',
              attributes: ['nama_toko']
            },
            {
              model: Cabang,
              as: 'cabang',
              attributes: ['nama_cabang']
            }
          ]
        }
      ],
      order: [['tanggal', 'DESC']]
    });

    const gaji = await BayarGaji.findAll({
      where: {
        is_deleted: false
      },
      include: [
        {
          model: RincianGaji,
          as: 'rincian_gaji',
          where: {
            is_deleted: false
          },
          include: [
            {
            model: Karyawan,
            as: 'karyawan',
            include: [{
              model: Toko,
              as: 'toko',
              where: {
                is_deleted: false
              },
            },
            {
              model: Cabang,
              as: 'cabang'
            }]
          },
        ]
        }
      ],
      raw: true
    })

    return [
      ...pengeluarans.map(p => ({
        ...p.get({ plain: true }),
        kategori_pengeluaran: p.kategori_pengeluaran.kategori_pengeluaran,
        metode: p.metode?.nama_metode || null,
        deskripsi_pengeluaran: p.deskripsi_pengeluaran.map(d => ({
          deskripsi: d.deskripsi,
          jumlah_pengeluaran: d.jumlah_pengeluaran,
          toko: d.toko?.nama_toko,
          cabang: d.cabang?.nama_cabang
        }))
      })),
      ...gaji.map(item => ({
        pengeluaran_id: item['bayar_gaji_id'],
        tanggal: item['bayar_gaji.tanggal'],
        cash_or_non: Boolean(item['bayar_gaji.cash_or_non']),
        total: item['bayar_gaji.total'],
        kategori_pengeluaran: "Gaji",
        metode: item['bayar_gaji.metode.nama_metode'],
        deskripsi_pengeluaran: [{
          deskripsi: 'Gaji',
          jumlah_pengeluaran: item['rincian_gaji.total_gaji_akhir'],
          toko: item['rincian_gaji.karyawan.toko.nama_toko'],
          cabang: item['rincian_gaji.karyawan.cabang.nama_cabang'],
        }]
      }))
    ].sort((a, b) => new Date(b.tanggal) - new Date(a.tanggal));``
  }

  static async getByKategori(id, start_date = null, end_date = null) {
    const whereClause = {
      kategori_pengeluaran_id: id,
      is_deleted: false
    };

    if (start_date && end_date) {
      whereClause.tanggal = {
        [Op.between]: [start_date, end_date]
      };
    }

    const pengeluarans = await Pengeluaran.findAll({
      where: whereClause,
      attributes: {
        exclude: ['is_deleted', 'metode_id', 'kategori_pengeluaran_id']
      },
      include: [
        {
          model: KategoriPengeluaran,
          as: 'kategori_pengeluaran',
          attributes: ['kategori_pengeluaran']
        },
        {
          model: MetodePembayaran,
          as: 'metode',
          attributes: ['nama_metode']
        },
        {
          model: DeskripsiPengeluaran,
          as: 'deskripsi_pengeluaran',
          attributes: ['deskripsi_pengeluaran_id', 'deskripsi', 'jumlah_pengeluaran'],
          include: [
            {
              model: Toko,
              as: 'toko',
              attributes: ['nama_toko']
            },
            {
              model: Cabang,
              as: 'cabang',
              attributes: ['nama_cabang']
            }
          ]
        }
      ],
      order: [['tanggal', 'DESC']]
    });

    return pengeluarans.map(pengeluaran => {
      const plainPengeluaran = pengeluaran.get({ plain: true });
      return {
        ...plainPengeluaran,
        kategori_pengeluaran: plainPengeluaran.kategori_pengeluaran.kategori_pengeluaran,
        metode: plainPengeluaran.metode?.nama_metode || null,
        deskripsi_pengeluaran: plainPengeluaran.deskripsi_pengeluaran.map(d => ({
          deskripsi: d.deskripsi,
          jumlah_pengeluaran: d.jumlah_pengeluaran,
          toko: d.toko?.nama_toko,
          cabang: d.cabang?.nama_cabang
        }))
      };
    });
  }

  static async getById(id) {
    const pengeluaran = await Pengeluaran.findOne({
      where: {
        pengeluaran_id: id,
        is_deleted: false
      },
      include: [
        {
          model: KategoriPengeluaran,
          as: 'kategori_pengeluaran',
          attributes: ['kategori_pengeluaran']
        },
        {
          model: MetodePembayaran,
          as: 'metode',
          attributes: ['nama_metode']
        },
        {
          model: DeskripsiPengeluaran,
          as: 'deskripsi_pengeluaran',
          attributes: ['deskripsi_pengeluaran_id', 'deskripsi', 'jumlah_pengeluaran'],
          include: [
            {
              model: Toko,
              as: 'toko',
              attributes: ['nama_toko']
            },
            {
              model: Cabang,
              as: 'cabang',
              attributes: ['nama_cabang']
            }
          ]
        }
      ]
    });

    if (!pengeluaran) return null;

    const plainPengeluaran = pengeluaran.get({ plain: true });
    return {
      ...plainPengeluaran,
      kategori_pengeluaran: plainPengeluaran.kategori_pengeluaran.kategori_pengeluaran,
      metode: plainPengeluaran.metode?.nama_metode || null,
      deskripsi_pengeluaran: plainPengeluaran.deskripsi_pengeluaran.map(d => ({
        deskripsi: d.deskripsi,
        jumlah_pengeluaran: d.jumlah_pengeluaran,
        toko: d.toko?.nama_toko,
        cabang: d.cabang?.nama_cabang
      }))
    };
  }

  static async getByToko(id, start_date = null, end_date = null) {
    const whereClause = {
      is_deleted: false
    };

    if (start_date && end_date) {
      whereClause.tanggal = {
        [Op.between]: [start_date, end_date]
      };
    }

    const deskripsiPengeluarans = await Pengeluaran.findAll({
      where: whereClause,
      attributes: {
        exclude: ['is_deleted', 'metode_id', 'kategori_pengeluaran_id']
      },
      include: [
        {
          model: KategoriPengeluaran,
          as: 'kategori_pengeluaran',
          attributes: ['kategori_pengeluaran']
        },
        {
          model: MetodePembayaran,
          as: 'metode',
          attributes: ['nama_metode']
        },
        {
          model: DeskripsiPengeluaran,
          as: 'deskripsi_pengeluaran',
          where: {
            toko_id: id,
            is_deleted: false
          },
          attributes: {
            exclude: ["deskripsi_pengeluaran_id", "toko_id", "cabang_id", "is_deleted"]
          },
          include: [
            {
              model: Toko,
              attributes: ['nama_toko'],
              as: 'toko'
            },
            {
              model: Cabang,
              attributes: ['nama_cabang'],
              as: 'cabang'
            }
          ]
        }
      ],
      order: [['tanggal', 'DESC']]
    });

    const gaji = await RincianGaji.findAll({
      where: {
        is_deleted: false,
      },
      include: [
        {
          model: BayarGaji,
          as: 'bayar_gaji',
          where: whereClause,
        },
        {
          model: Karyawan,
          as: 'karyawan',
          where: {
            toko_id: id,
            is_deleted: false,
          },
          include: [{
            model: Toko,
            as: 'toko',
            where: {
              toko_id: id,
              is_deleted: false,
            },
          },
          {
            model: Cabang,
            as: 'cabang'
          }]
        }
      ],
      raw: true
    })
    return [
      ...deskripsiPengeluarans.map(item => ({
        ...item.get({ plain: true }),
        metode: item.metode?.nama_metode || null,
        kategori_pengeluaran: item.kategori_pengeluaran.kategori_pengeluaran,
        deskripsi_pengeluaran: item.deskripsi_pengeluaran.map(d => ({
          deskripsi_pengeluaran_id: d.deskripsi_pengeluaran_id,
          pengeluaran_id: d.pengeluaran_id,
          deskripsi: d.deskripsi,
          jumlah_pengeluaran: d.jumlah_pengeluaran,
          toko: d.toko?.nama_toko,
          cabang: d.cabang?.nama_cabang
        }))
      })),
      ...gaji.map(item => ({
        pengeluaran_id: item['bayar_gaji.bayar_gaji_id'],
        tanggal: item['bayar_gaji.tanggal'],
        cash_or_non: Boolean(item['bayar_gaji.cash_or_non']),
        total: item['bayar_gaji.total'],
        kategori_pengeluaran: "Gaji",
        metode: item['bayar_gaji.metode.nama_metode'],
        deskripsi_pengeluaran: [{
          deskripsi: 'Gaji',
          jumlah_pengeluaran: item['total_gaji_akhir'],
          toko: item['karyawan.toko.nama_toko'],
          cabang: item['karyawan.cabang.nama_cabang'],
        }]
      }))
    ].sort((a, b) => new Date(b.tanggal) - new Date(a.tanggal));
  }

  static async update(id, data) {
    const transaction = await sequelize.transaction();

    try {
      const pengeluaran = await Pengeluaran.findOne({
        where: {
          pengeluaran_id: id,
          is_deleted: false
        }
      });

      if (!pengeluaran) return null;
      await pengeluaran.update(data, { transaction });

      if (data.deskripsi_pengeluaran && Array.isArray(data.deskripsi_pengeluaran)) {
        const DeskripsiPengeluaran = data.deskripsi_pengeluaran.map(item => ({
          ...item,
          pengeluaran_id: pengeluaran.pengeluaran_id
        }));

        await DeskripsiPengeluaranService.update(DeskripsiPengeluaran, { transaction });
      }

      await transaction.commit();

      const updatePengeluaran = await this.getById(id);
      return updatePengeluaran;
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  static async delete(id) {
    const pengeluaran = await Pengeluaran.findByPk(id);
    if (!pengeluaran) return null;
    await pengeluaran.update({ is_deleted: true });
    return true;
  }
}

module.exports = PengeluaranService;
