const { Op } = require("sequelize");
const { sequelize } = require("../models");
const Pemasukan = require("../models/pemasukan");  
const DeskripsiPemasukanService = require("./deskripsiPemasukanService");
const KategoriPemasukan = require("../models/kategoriPemasukan");
const MetodePembayaran = require("../models/metodePembayaran");
const DeskripsiPemasukan = require("../models/deskripsiPemasukan");
const Toko = require("../models/toko");
const Cabang = require("../models/cabang");
const XLSX = require('xlsx');
class PemasukanService {  
  static async create(data) {  
    const transaction = await sequelize.transaction();
    try {
      const pemasukan = await Pemasukan.create(data, { transaction });
      const deskripsiPemasukan = data.deskripsi_pemasukan.map(item => ({
        ...item,
        pemasukan_id: pemasukan.pemasukan_id
      }));

      await DeskripsiPemasukanService.create(deskripsiPemasukan, { transaction });
      
      await transaction.commit();
      return pemasukan;
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }  
  
  static async getAll(start_date = null, end_date = null) {  
    const whereClause = {
      is_deleted: false
    };

    if (start_date && end_date) {
      whereClause.tanggal = {
        [Op.between]: [start_date, end_date]
      };
    }

    const pemasukans = await Pemasukan.findAll({
      where: whereClause,
      attributes: {
        exclude: ['is_deleted', 'metode_id', 'kategori_pemasukan_id']
      },
      include: [
        {
          model: KategoriPemasukan,
          as: 'kategori_pemasukan',
          attributes: ['kategori_pemasukan']
        },
        {
          model: MetodePembayaran,
          as: 'metode',
          attributes: ['nama_metode']
        },
        {
          model: DeskripsiPemasukan,
          as: 'deskripsi_pemasukan',
          attributes: ['deskripsi_pemasukan_id', 'deskripsi', 'jumlah_pemasukan'],
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

    return pemasukans.map(p => ({
      ...p.get({ plain: true }),
      kategori_pemasukan: p.kategori_pemasukan.kategori_pemasukan,
      metode: p.metode?.nama_metode || null,
      deskripsi_pemasukan: p.deskripsi_pemasukan.map(d => ({
        deskripsi: d.deskripsi,
        jumlah_pemasukan: d.jumlah_pemasukan,
        toko: d.toko?.nama_toko,
        cabang: d.cabang?.nama_cabang
      }))
    }));
  }
  
  static async getById(id) {  
    const pemasukan =  await Pemasukan.findOne({
      where: {
        pemasukan_id: id,
        is_deleted: false
      },
      attributes: {
        exclude: ['is_deleted', 'metode_id', 'kategori_pemasukan_id']
      },
      include: [
        {
          model: KategoriPemasukan,
          as: 'kategori_pemasukan',
          attributes: ['kategori_pemasukan']
        },
        {
          model: MetodePembayaran,
          as: 'metode',
          attributes: ['nama_metode']
        },
        {
          model: DeskripsiPemasukan,
          as: 'deskripsi_pemasukan',
          attributes: ['deskripsi_pemasukan_id', 'deskripsi', 'jumlah_pemasukan'],
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
    });  
    if (!pemasukan) return null;

    const plainPemasukan = pemasukan.get({ plain: true });
    return {
      ...plainPemasukan,
      kategori_pemasukan: plainPemasukan.kategori_pemasukan.kategori_pemasukan,
      metode: plainPemasukan.metode?.nama_metode || null,
      deskripsi_pemasukan: plainPemasukan.deskripsi_pemasukan.map(d => ({
        deskripsi: d.deskripsi,
        jumlah_pemasukan: d.jumlah_pemasukan,
        toko: d.toko?.nama_toko,
        cabang: d.cabang?.nama_cabang
      }))
    };
  }  
  static async getByKategori(id, start_date = null, end_date = null) {
    const whereClause = {
      kategori_pemasukan_id: id,
      is_deleted: false
    };

    if (start_date && end_date) {
      whereClause.tanggal = {
        [Op.between]: [start_date, end_date]
      };
    }

    const pemasukans = await Pemasukan.findAll({
      where: whereClause,
      attributes: {
        exclude: ['is_deleted', 'metode_id', 'kategori_pemasukan_id']
      },
      include: [
        {
          model: KategoriPemasukan,
          as: 'kategori_pemasukan',
          attributes: ['kategori_pemasukan']
        },
        {
          model: MetodePembayaran,
          as: 'metode',
          attributes: ['nama_metode']
        },
        {
          model: DeskripsiPemasukan,
          as: 'deskripsi_pemasukan',
          attributes: ['deskripsi_pemasukan_id', 'deskripsi', 'jumlah_pemasukan'],
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

    return pemasukans.map(pemasukan => {
      const plainPemasukan = pemasukan.get({ plain: true });
      return {
        ...plainPemasukan,
        kategori_pemasukan: plainPemasukan.kategori_pemasukan.kategori_pemasukan,
        metode: plainPemasukan.metode?.nama_metode || null,
        deskripsi_pemasukan: plainPemasukan.deskripsi_pemasukan.map(d => ({
          deskripsi: d.deskripsi,
          jumlah_pemasukan: d.jumlah_pemasukan,
          toko: d.toko?.nama_toko,
          cabang: d.cabang?.nama_cabang
        }))
      };
    });
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

    const deskripsiPemasukans = await Pemasukan.findAll({
      where: whereClause,
      attributes: {
        exclude: ['is_deleted','metode_id', 'kategori_pemasukan_id', 'cash_or_non']
      },
      include: [
        {
          model: KategoriPemasukan,
          as: 'kategori_pemasukan',
          attributes: ['kategori_pemasukan']
        },
        {
          model: MetodePembayaran,
          as:'metode',
          attributes: ['nama_metode']
        },
        {
          model: DeskripsiPemasukan,
          as: 'deskripsi_pemasukan',
          where: {
            toko_id: id,
            is_deleted: false
          },
          attributes: {
            exclude: ["deskripsi_pemasukan_id", "toko_id", "cabang_id", "is_deleted"]
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

    return deskripsiPemasukans.map(item => ({
      ...item.get({ plain: true }),
      metode: item.metode?.nama_metode || null,
      kategori_pemasukan: item.kategori_pemasukan.kategori_pemasukan,
      deskripsi_pemasukan: item.deskripsi_pemasukan.map(d => ({
        deskripsi_pemasukan_id: d.deskripsi_pemasukan_id,
        pemasukan_id: d.pemasukan_id,
        deskripsi: d.deskripsi,
        jumlah_pemasukan: d.jumlah_pemasukan,
        is_deleted: d.is_deleted,
        toko: d.toko?.nama_toko,
        cabang: d.cabang?.nama_cabang
      }))
    }));
  }

  static async getByCashOrNon(cash_or_non, start_date = null, end_date = null) {
    const whereClause = {
      cash_or_non: cash_or_non,
      is_deleted: false
    };
    if (start_date && end_date) {
      whereClause.tanggal = {
        [Op.between]: [start_date, end_date]
      };
    }
    const deskripsiPemasukans = await Pemasukan.findAll({
      where: whereClause,
      attributes: {
        exclude: ['is_deleted','metode_id', 'kategori_pemasukan_id', 'cash_or_non']
      },
      include: [
        {
          model: KategoriPemasukan,
          as: 'kategori_pemasukan',
          attributes: ['kategori_pemasukan']
        },
        {
          model: MetodePembayaran,
          as:'metode',
          attributes: ['nama_metode']
        },
        {
          model: DeskripsiPemasukan,
          as: 'deskripsi_pemasukan',
          where: {
            is_deleted: false
          },
          attributes: {
            exclude: ["deskripsi_pemasukan_id", "toko_id", "cabang_id", "is_deleted"]
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

    return deskripsiPemasukans.map(item => ({
      ...item.get({ plain: true }),
      metode: item.metode?.nama_metode || null,
      kategori_pemasukan: item.kategori_pemasukan.kategori_pemasukan,
      deskripsi_pemasukan: item.deskripsi_pemasukan.map(d => ({
        deskripsi_pemasukan_id: d.deskripsi_pemasukan_id,
        pemasukan_id: d.pemasukan_id,
        deskripsi: d.deskripsi,
        jumlah_pemasukan: d.jumlah_pemasukan,
        is_deleted: d.is_deleted,
        toko: d.toko?.nama_toko,
        cabang: d.cabang?.nama_cabang
      }))
    }));
  }

  
  static async update(id, data) {  
    const transaction = await sequelize.transaction();

    try {
      const pemasukan = await Pemasukan.findOne({
        where: {
          pemasukan_id: id,
          is_deleted: false
        }
      });

      if (!pemasukan) return null;
      await pemasukan.update(data, { transaction });

      if (data.deskripsi_pemasukan && Array.isArray(data.deskripsi_pemasukan)) {
        const deskripsiPemasukan = data.deskripsi_pemasukan.map(item => ({
          ...item,
          pemasukan_id: pemasukan.pemasukan_id
        }));

        await DeskripsiPemasukanService.update(deskripsiPemasukan, { transaction });
      }

      await transaction.commit();

      const updatedPemasukan = await this.getById(id);
      return updatedPemasukan;
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }
  
  static async delete(id) {  
    const pemasukan = await Pemasukan.findByPk(id);  
    if (!pemasukan) return null;  
    await DeskripsiPemasukanService.delete(id);
    await pemasukan.destroy();  
    return true;  
  }  

  static async exportToExcel(startDate, endDate) {
    const result = await this.getAll(startDate, endDate);

    const data = result.map(item => ({
      nomor: item.pemasukan_id,
      tanggal: item.tanggal,
      deskripsi_pemasukan: item.deskripsi_pemasukan
      .map(d => d.deskripsi)
      .join(', '),
      kategori_pemasukan: item.kategori_pemasukan,
      cash_or_non: item.metode ?? "Cash",
      pemasukan: item.total
    }));

    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.json_to_sheet(data);
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Pemasukan');

    return workbook;
  }
}  
  
module.exports = PemasukanService;
