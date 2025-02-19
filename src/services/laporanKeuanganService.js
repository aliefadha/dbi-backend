const { Op } = require("sequelize");
const BarangCustom = require("../models/barangCustom");
const BarangHandmade = require("../models/barangHandmade");
const BarangNonHandmade = require("../models/barangNonHandmade");
const Cabang = require("../models/cabang");
const DeskripsiPemasukan = require("../models/deskripsiPemasukan");
const DeskripsiPengeluaran = require("../models/deskripsiPengeluaran");
const KategoriPemasukan = require("../models/kategoriPemasukan");
const KategoriPengeluaran = require("../models/kategoriPengeluaran");
const Packaging = require("../models/packaging");
const Pemasukan = require("../models/pemasukan");
const Pembelian = require("../models/pembelian");
const Pengeluaran = require("../models/pengeluaran");
const Penjualan = require("../models/penjualan");
const ProdukPembelian = require("../models/produkPembelian");
const ProdukPenjualan = require("../models/produkPenjualan");
const Toko = require("../models/toko");
const PembelianGudang = require("../models/pembelianGudang");
const ProdukPembelianGudang = require("../models/produkPembelianGudang");
const BarangHandmadeGudang = require("../models/barangHandmadeGudang");
const BarangNonHandmadeGudang = require("../models/barangNonHandmadeGudang");
const BarangMentah = require("../models/barangMentah");
const PackagingGudang = require("../models/packagingGudang");
const ProdukPenjualanGudang = require("../models/produkPenjualanGudang");
const PenjualanGudang = require("../models/penjualanGudang");

class LaporanKeuanganService {

  static async getKategori() {
    const [kategoriPemasukan, kategoriPengeluaran] = await Promise.all([
      KategoriPemasukan.findAll({
        where: {
          is_deleted: false
        },
        attributes: ['kategori_pemasukan_id', 'kategori_pemasukan']
      }),
      KategoriPengeluaran.findAll({
        where: {
          is_deleted: false
        },
        attributes: ['kategori_pengeluaran_id', 'kategori_pengeluaran']
      })
    ]);

    const kategori = [
      ...kategoriPemasukan.map(item => ({
        kategori_pemasukan_id: item.kategori_pemasukan_id,
        kategori: `${item.kategori_pemasukan} (Pemasukan)`,
      })),
      ...kategoriPengeluaran.map(item => ({
        kategori_pengeluaran_id: item.kategori_pengeluaran_id,
        kategori: `${item.kategori_pengeluaran} (Pengeluaran)`,
      }))
    ];

    return kategori;
  }

  static async getAll(toko_id = null, startDate = null, endDate = null) {
    const whereClause = {
      is_deleted: false
    };

    if (startDate && endDate) {
      whereClause.tanggal = {
        [Op.between]: [startDate, endDate]
      };
    }

    const pengeluaranWhereClause = {
      is_deleted: false
    };

    if (toko_id) {
      pengeluaranWhereClause.toko_id = toko_id;
    }

    const pengeluaran = await DeskripsiPengeluaran.findAll({
      where: pengeluaranWhereClause,
      attributes: ['pengeluaran_id', 'deskripsi', 'jumlah_pengeluaran',],
      include: [
        {
          model: Pengeluaran,
          as: 'pengeluaran',
          where: whereClause,
          attributes: ['tanggal'],
          include: [
            {
              model: KategoriPengeluaran,
              as: 'kategori_pengeluaran',
              attributes: ["kategori_pengeluaran"],
            },
          ]
        },
        {
          model: Toko,
          as: 'toko',
          attributes: ["nama_toko"]
        },
        {
          model: Cabang,
          as: 'cabang',
          attributes: ["nama_cabang"]
        },
      ],
      raw: true,
      nest: true
    });

    const transformedPengeluaran = pengeluaran.map(item => ({
      pengeluaran_id: item.pengeluaran_id,
      deskripsi: item.deskripsi,
      jumlah_pengeluaran: item.jumlah_pengeluaran,
      nama_toko: item.toko.nama_toko,
      nama_cabang: item.cabang.nama_cabang,
      kategori_pengeluaran: item.pengeluaran.kategori_pengeluaran.kategori_pengeluaran,
      tanggal: item.pengeluaran.tanggal
    }));

    const data = await Pembelian.findAll({
      where: {
        ...whereClause,
        ...(toko_id && { toko_id: toko_id })
      },
      attributes: ['pembelian_id', 'tanggal', 'total_pembelian'],
      include: [
        {
          model: Toko,
          as: "toko",
          attributes: ["nama_toko"]
        },
      ],
      raw: true,
      nest: true
    });

    const transformedPembelian = await Promise.all(data.map(async (pembelian) => {
      const produk = await ProdukPembelian.findAll({
        where: {
          pembelian_id: pembelian.pembelian_id,
          is_deleted: false
        },
        include: [
          {
            model: BarangHandmade,
            as: 'barang_handmade',
            attributes: ["nama_barang"]
          },
          {
            model: BarangNonHandmade,
            as: 'barang_non_handmade',
            attributes: ["nama_barang"]
          },
          {
            model: BarangCustom,
            as: 'barang_custom',
            attributes: ["nama_barang"]
          },
          {
            model: Packaging,
            as: 'packaging',
            attributes: ["nama_packaging"]
          },
          {
            model: Cabang,
            as: 'cabang',
            attributes: ["nama_cabang"]
          }
        ],
        raw: true,
        nest: true
      });

      return {
        pembelian_id: pembelian.pembelian_id,
        tanggal: pembelian.tanggal,
        total_pengeluaran: pembelian.total_pembelian,
        nama_toko: pembelian.toko.nama_toko,
        produk: produk.map(item => ({
          nama_barang: item.barang_handmade?.nama_barang ||
            item.barang_non_handmade?.nama_barang ||
            item.barang_custom?.nama_barang ||
            item.packaging?.nama_packaging,
          nama_cabang: item.cabang?.nama_cabang
        })),
        kategori_pengeluaran: "Pembelian"
      };
    }));

    const pemasukan = await DeskripsiPemasukan.findAll({
      where: {
        is_deleted: false,
        ...(toko_id && { toko_id: toko_id })
      },
      attributes: ['pemasukan_id', 'deskripsi', 'jumlah_pemasukan',],
      include: [
        {
          model: Pemasukan,
          as: 'pemasukan',
          where: whereClause,
          attributes: ['tanggal'],
          include: [
            {
              model: KategoriPemasukan,
              as: 'kategori_pemasukan',
              attributes: ["kategori_pemasukan"],
            },
          ]
        },
        {
          model: Toko,
          as: 'toko',
          attributes: ["nama_toko"]
        },
        {
          model: Cabang,
          as: 'cabang',
          attributes: ["nama_cabang"]
        },
      ],
      raw: true,
      nest: true
    });

    const transformedPemasukan = pemasukan.map(item => ({
      pemasukan_id: item.pemasukan_id,
      deskripsi: item.deskripsi,
      jumlah_pemasukan: item.jumlah_pemasukan,
      nama_toko: item.toko.nama_toko,
      nama_cabang: item.cabang.nama_cabang,
      kategori_pemasukan: item.pemasukan.kategori_pemasukan.kategori_pemasukan,
      tanggal: item.pemasukan.tanggal
    }));

    const penjualanData = await Penjualan.findAll({
      where: {
        ...whereClause,
        ...(toko_id && { toko_id: toko_id })
      },
      attributes: ['penjualan_id', 'tanggal', 'total_penjualan'],
      include: [
        {
          model: Toko,
          as: "toko",
          attributes: ["nama_toko"]
        },
      ],
      raw: true,
      nest: true
    });

    const transformedPenjualan = await Promise.all(penjualanData.map(async (penjualan) => {
      const produk = await ProdukPenjualan.findAll({
        where: {
          penjualan_id: penjualan.penjualan_id,
          is_deleted: false
        },
        include: [
          {
            model: BarangHandmade,
            as: 'barang_handmade',
            attributes: ["nama_barang"]
          },
          {
            model: BarangNonHandmade,
            as: 'barang_non_handmade',
            attributes: ["nama_barang"]
          },
          {
            model: BarangCustom,
            as: 'barang_custom',
            attributes: ["nama_barang"]
          },
          {
            model: Packaging,
            as: 'packaging',
            attributes: ["nama_packaging"]
          },
          {
            model: Cabang,
            as: 'cabang',
            attributes: ["nama_cabang"]
          }
        ],
        raw: true,
        nest: true
      });

      return {
        penjualan_id: penjualan.penjualan_id,
        tanggal: penjualan.tanggal,
        total_pengeluaran: penjualan.total_penjualan,
        nama_toko: penjualan.toko.nama_toko,
        produk: produk.map(item => ({
          nama_barang: item.barang_handmade?.nama_barang ||
            item.barang_non_handmade?.nama_barang ||
            item.barang_custom?.nama_barang ||
            item.packaging?.nama_packaging,
          nama_cabang: item.cabang?.nama_cabang
        })),
        kategori_pemasukan: "Penjualan"
      };
    }));

    const totalPemasukan = [
      ...transformedPemasukan.map(item => item.jumlah_pemasukan),
      ...transformedPenjualan.map(item => item.total_pengeluaran)
    ].reduce((total, amount) => total + amount, 0);

    const totalPengeluaran = [
      ...pengeluaran.map(item => item.jumlah_pengeluaran),
      ...transformedPembelian.map(item => item.total_pengeluaran)
    ].reduce((total, amount) => total + amount, 0);

    const laporan = {
      pengeluaran: [...transformedPengeluaran, ...transformedPembelian].sort((a, b) =>
        new Date(a.tanggal) - new Date(b.tanggal)
      ),
      pemasukan: [...transformedPemasukan, ...transformedPenjualan],
      total_pemasukan: totalPemasukan,
      total_pengeluaran: totalPengeluaran,
      keuntungan: totalPemasukan - totalPengeluaran,
      produk_terjual: transformedPenjualan.reduce((total, item) => total + item.produk.length, 0),
    }
    return laporan;
  }

  static async getGudang(startDate = null, endDate = null) {
    const whereClause = {
      is_deleted: false
    };

    if (startDate && endDate) {
      whereClause.tanggal = {
        [Op.between]: [startDate, endDate]
      };
    }

    const pengeluaranWhereClause = {
      is_deleted: false
    };

    pengeluaranWhereClause.toko_id = 1;

    const pengeluaran = await DeskripsiPengeluaran.findAll({
      where: pengeluaranWhereClause,
      attributes: ['pengeluaran_id', 'deskripsi', 'jumlah_pengeluaran',],
      include: [
        {
          model: Pengeluaran,
          as: 'pengeluaran',
          where: whereClause,
          attributes: ['tanggal'],
          include: [
            {
              model: KategoriPengeluaran,
              as: 'kategori_pengeluaran',
              attributes: ["kategori_pengeluaran"]
            },
          ]
        },
        {
          model: Toko,
          as: 'toko',
          attributes: ["nama_toko"]
        },
        {
          model: Cabang,
          as: 'cabang',
          attributes: ["nama_cabang"]
        },
      ],
      raw: true,
      nest: true
    });

    const transformedPengeluaran = pengeluaran.map(item => ({
      pengeluaran_id: item.pengeluaran_id,
      deskripsi: item.deskripsi,
      jumlah_pengeluaran: item.jumlah_pengeluaran,
      nama_toko: item.toko.nama_toko,
      kategori_pengeluaran: item.pengeluaran.kategori_pengeluaran.kategori_pengeluaran,
      tanggal: item.pengeluaran.tanggal
    }));

    const data = await PembelianGudang.findAll({
      where: {
        ...whereClause,
      },
      attributes: ['pembelian_id', 'tanggal', 'total_pembelian'],
      raw: true,
      nest: true
    });

    const transformedPembelian = await Promise.all(data.map(async (pembelian) => {
      const produk = await ProdukPembelianGudang.findAll({
        where: {
          pembelian_id: pembelian.pembelian_id,
          is_deleted: false
        },
        include: [
          {
            model: BarangHandmadeGudang,
            as: 'barang_handmade',
            attributes: ["nama_barang"]
          },
          {
            model: BarangNonHandmadeGudang,
            as: 'barang_nonhandmade',
            attributes: ["nama_barang"]
          },
          {
            model: BarangMentah,
            as: 'barang_mentah',
            attributes: ["nama_barang"],
          },
          {
            model: PackagingGudang,
            as: 'packaging',
            attributes: ["nama_packaging"]
          },
        ],
        raw: true,
        nest: true
      });

      return {
        pembelian_id: pembelian.pembelian_id,
        tanggal: pembelian.tanggal,
        total_pengeluaran: pembelian.total_pembelian,
        produk: produk.map(item => ({
          nama_barang: item.barang_handmade?.nama_barang ||
            item.barang_nonhandmade?.nama_barang ||
            item.barang_mentah?.nama_barang ||
            item.packaging?.nama_packaging,
        })),
        kategori_pengeluaran: "Pembelian"
      };
    }));

    const pemasukan = await DeskripsiPemasukan.findAll({
      where: {
        is_deleted: false,
        toko_id: 1
      },
      attributes: ['pemasukan_id', 'deskripsi', 'jumlah_pemasukan',],
      include: [
        {
          model: Pemasukan,
          as: 'pemasukan',
          where: whereClause,
          attributes: ['tanggal'],
          include: [
            {
              model: KategoriPemasukan,
              as: 'kategori_pemasukan',
              attributes: ["kategori_pemasukan"]
            },
          ]
        },
        {
          model: Toko,
          as: 'toko',
          attributes: ["nama_toko"]
        },
      ],
      raw: true,
      nest: true
    });

    const transformedPemasukan = pemasukan.map(item => ({
      pemasukan_id: item.pemasukan_id,
      deskripsi: item.deskripsi,
      jumlah_pemasukan: item.jumlah_pemasukan,
      nama_toko: item.toko.nama_toko,
      kategori_pemasukan: item.pemasukan.kategori_pemasukan.kategori_pemasukan,
      tanggal: item.pemasukan.tanggal
    }));

    const penjualanData = await PenjualanGudang.findAll({
      where: {
        ...whereClause,
      },
      attributes: ['penjualan_id', 'tanggal', 'total_penjualan'],
      raw: true,
      nest: true
    });

    const transformedPenjualan = await Promise.all(penjualanData.map(async (penjualan) => {
      const produk = await ProdukPenjualanGudang.findAll({
        where: {
          penjualan_id: penjualan.penjualan_id,
          is_deleted: false
        },
        include: [
          {
            model: BarangHandmadeGudang,
            as: 'barang_handmade',
            attributes: ["nama_barang"]
          },
          {
            model: BarangNonHandmadeGudang,
            as: 'barang_nonhandmade',
            attributes: ["nama_barang"]
          },
          {
            model: BarangMentah,
            as: 'barang_mentah',
            attributes: ["nama_barang"],
          },
          {
            model: PackagingGudang,
            as: 'packaging',
            attributes: ["nama_packaging"]
          },
        ],
        raw: true,
        nest: true
      });

      return {
        penjualan_id: penjualan.penjualan_id,
        tanggal: penjualan.tanggal,
        total_pemasukan: penjualan.total_penjualan,
        produk: produk.map(item => ({
          nama_barang: item.barang_handmade?.nama_barang ||
            item.barang_nonhandmade?.nama_barang ||
            item.barang_mentah?.nama_barang ||
            item.packaging?.nama_packaging,
        })),
        kategori_pemasukan: "Penjualan"
      };
    }));

    const totalPemasukan = [
      ...transformedPemasukan.map(item => item.jumlah_pemasukan),
      ...transformedPenjualan.map(item => item.total_pemasukan)
    ].reduce((total, amount) => total + amount, 0);

    const totalPengeluaran = [
      ...pengeluaran.map(item => item.jumlah_pengeluaran),
      ...transformedPembelian.map(item => item.total_pengeluaran)
    ].reduce((total, amount) => total + amount, 0);

    const laporan = {
      pengeluaran: [...transformedPengeluaran, ...transformedPembelian],
      pemasukan: [...transformedPemasukan, ...transformedPenjualan],
      total_pemasukan: totalPemasukan,
      total_pengeluaran: totalPengeluaran,
      keuntungan: totalPemasukan - totalPengeluaran,
      produk_terjual: transformedPenjualan.reduce((total, item) => total + item.produk.length, 0),
    }

    return laporan
  }

  static async getAllPemasukan(toko_id = null, startDate = null, endDate = null) {
    const whereClause = {
      is_deleted: false
    };

    if (startDate && endDate) {
      whereClause.tanggal = {
        [Op.between]: [startDate, endDate]
      };
    }

    const pemasukan = await DeskripsiPemasukan.findAll({
      where: {
        is_deleted: false,
        ...(toko_id && { toko_id: toko_id })
      },
      attributes: ['pemasukan_id', 'deskripsi', 'jumlah_pemasukan',],
      include: [
        {
          model: Pemasukan,
          as: 'pemasukan',
          where: whereClause,
          attributes: ['tanggal'],
          include: [
            {
              model: KategoriPemasukan,
              as: 'kategori_pemasukan',
              attributes: ["kategori_pemasukan"]
            },
          ]
        },
        {
          model: Toko,
          as: 'toko',
          attributes: ["nama_toko"]
        },
        {
          model: Cabang,
          as: 'cabang',
          attributes: ["nama_cabang"]
        },
      ],
      raw: true,
      nest: true
    });

    const transformedPemasukan = pemasukan.map(item => ({
      pemasukan_id: item.pemasukan_id,
      deskripsi: item.deskripsi,
      jumlah_pemasukan: item.jumlah_pemasukan,
      nama_toko: item.toko.nama_toko,
      nama_cabang: item.cabang.nama_cabang,
      kategori_pemasukan: item.pemasukan.kategori_pemasukan.kategori_pemasukan,
      tanggal: item.pemasukan.tanggal
    }));

    const penjualanData = await Penjualan.findAll({
      where: {
        ...whereClause,
        ...(toko_id && { toko_id: toko_id })
      },
      attributes: ['penjualan_id', 'tanggal', 'total_penjualan'],
      include: [
        {
          model: Toko,
          as: "toko",
          attributes: ["nama_toko"]
        },
      ],
      raw: true,
      nest: true
    });

    const transformedPenjualan = await Promise.all(penjualanData.map(async (penjualan) => {
      const produk = await ProdukPenjualan.findAll({
        where: {
          penjualan_id: penjualan.penjualan_id,
          is_deleted: false
        },
        include: [
          {
            model: BarangHandmade,
            as: 'barang_handmade',
            attributes: ["nama_barang"]
          },
          {
            model: BarangNonHandmade,
            as: 'barang_non_handmade',
            attributes: ["nama_barang"]
          },
          {
            model: BarangCustom,
            as: 'barang_custom',
            attributes: ["nama_barang"]
          },
          {
            model: Packaging,
            as: 'packaging',
            attributes: ["nama_packaging"]
          },
          {
            model: Cabang,
            as: 'cabang',
            attributes: ["nama_cabang"]
          }
        ],
        raw: true,
        nest: true
      });

      return {
        penjualan_id: penjualan.penjualan_id,
        tanggal: penjualan.tanggal,
        total_pemasukan: penjualan.total_penjualan,
        nama_toko: penjualan.toko.nama_toko,
        produk: produk.map(item => ({
          nama_barang: item.barang_handmade?.nama_barang ||
            item.barang_non_handmade?.nama_barang ||
            item.barang_custom?.nama_barang ||
            item.packaging?.nama_packaging,
          nama_cabang: item.cabang?.nama_cabang
        })),
        kategori_pemasukan: "Penjualan"
      };
    }));

    const totalPemasukan = [
      ...transformedPemasukan.map(item => item.jumlah_pemasukan),
      ...transformedPenjualan.map(item => item.total_pemasukan)
    ].reduce((total, amount) => total + amount, 0);

    return {
      pemasukan: [...transformedPemasukan, ...transformedPenjualan].sort((a, b) =>
        new Date(b.tanggal) - new Date(a.tanggal)
      ),
      total_pemasukan: totalPemasukan,
      produk_terjual: transformedPenjualan.reduce((total, item) => total + item.produk.length, 0),
    };
  }

  static async getPemasukanGudang(startDate = null, endDate = null) {
    const whereClause = {
      is_deleted: false
    };

    if (startDate && endDate) {
      whereClause.tanggal = {
        [Op.between]: [startDate, endDate]
      };
    }

    const pemasukan = await DeskripsiPemasukan.findAll({
      where: {
        is_deleted: false,
        toko_id: 1
      },
      attributes: ['pemasukan_id', 'deskripsi', 'jumlah_pemasukan',],
      include: [
        {
          model: Pemasukan,
          as: 'pemasukan',
          where: whereClause,
          attributes: ['tanggal'],
          include: [
            {
              model: KategoriPemasukan,
              as: 'kategori_pemasukan',
              attributes: ["kategori_pemasukan"]
            },
          ]
        },
        {
          model: Toko,
          as: 'toko',
          attributes: ["nama_toko"]
        },
      ],
      raw: true,
      nest: true
    });

    const transformedPemasukan = pemasukan.map(item => ({
      pemasukan_id: item.pemasukan_id,
      deskripsi: item.deskripsi,
      jumlah_pemasukan: item.jumlah_pemasukan,
      nama_toko: item.toko.nama_toko,
      kategori_pemasukan: item.pemasukan.kategori_pemasukan.kategori_pemasukan,
      tanggal: item.pemasukan.tanggal
    }));

    const penjualanData = await PenjualanGudang.findAll({
      where: {
        ...whereClause,
      },
      attributes: ['penjualan_id', 'tanggal', 'total_penjualan'],
      raw: true,
      nest: true
    });

    const transformedPenjualan = await Promise.all(penjualanData.map(async (penjualan) => {
      const produk = await ProdukPenjualanGudang.findAll({
        where: {
          penjualan_id: penjualan.penjualan_id,
          is_deleted: false
        },
        include: [
          {
            model: BarangHandmadeGudang,
            as: 'barang_handmade',
            attributes: ["nama_barang"]
          },
          {
            model: BarangNonHandmadeGudang,
            as: 'barang_nonhandmade',
            attributes: ["nama_barang"]
          },
          {
            model: BarangMentah,
            as: 'barang_mentah',
            attributes: ["nama_barang"],
          },
          {
            model: PackagingGudang,
            as: 'packaging',
            attributes: ["nama_packaging"]
          },
        ],
        raw: true,
        nest: true
      });

      return {
        penjualan_id: penjualan.penjualan_id,
        tanggal: penjualan.tanggal,
        total_pemasukan: penjualan.total_penjualan,
        produk: produk.map(item => ({
          nama_barang: item.barang_handmade?.nama_barang ||
            item.barang_nonhandmade?.nama_barang ||
            item.barang_mentah?.nama_barang ||
            item.packaging?.nama_packaging,
        })),
        kategori_pemasukan: "Penjualan"
      };
    }));

    const totalPemasukan = [
      ...transformedPemasukan.map(item => item.jumlah_pemasukan),
      ...transformedPenjualan.map(item => item.total_pemasukan)
    ].reduce((total, amount) => total + amount, 0);

    return {
      pemasukan: [...transformedPemasukan, ...transformedPenjualan].sort((a, b) =>
        new Date(b.tanggal) - new Date(a.tanggal)
      ),
      total_pemasukan: totalPemasukan,
      produk_terjual: transformedPenjualan.reduce((total, item) => total + item.produk.length, 0),
    };
  }

  static async getAllPengeluaran(toko_id = null, startDate = null, endDate = null) {
    const whereClause = {
      is_deleted: false
    };

    if (startDate && endDate) {
      whereClause.tanggal = {
        [Op.between]: [startDate, endDate]
      };
    }

    const pengeluaranWhereClause = {
      is_deleted: false
    };

    if (toko_id) {
      pengeluaranWhereClause.toko_id = toko_id;
    }

    const pengeluaran = await DeskripsiPengeluaran.findAll({
      where: pengeluaranWhereClause,
      attributes: ['pengeluaran_id', 'deskripsi', 'jumlah_pengeluaran',],
      include: [
        {
          model: Pengeluaran,
          as: 'pengeluaran',
          where: whereClause,
          attributes: ['tanggal'],
          include: [
            {
              model: KategoriPengeluaran,
              as: 'kategori_pengeluaran',
              attributes: ["kategori_pengeluaran"]
            },
          ]
        },
        {
          model: Toko,
          as: 'toko',
          attributes: ["nama_toko"]
        },
        {
          model: Cabang,
          as: 'cabang',
          attributes: ["nama_cabang"]
        },
      ],
      raw: true,
      nest: true
    });

    const transformedPengeluaran = pengeluaran.map(item => ({
      pengeluaran_id: item.pengeluaran_id,
      deskripsi: item.deskripsi,
      jumlah_pengeluaran: item.jumlah_pengeluaran,
      nama_toko: item.toko.nama_toko,
      nama_cabang: item.cabang.nama_cabang,
      kategori_pengeluaran: item.pengeluaran.kategori_pengeluaran.kategori_pengeluaran,
      tanggal: item.pengeluaran.tanggal
    }));

    const data = await Pembelian.findAll({
      where: {
        ...whereClause,
        ...(toko_id && { toko_id: toko_id })
      },
      attributes: ['pembelian_id', 'tanggal', 'total_pembelian'],
      include: [
        {
          model: Toko,
          as: "toko",
          attributes: ["nama_toko"]
        },
      ],
      raw: true,
      nest: true
    });

    const transformedPembelian = await Promise.all(data.map(async (pembelian) => {
      const produk = await ProdukPembelian.findAll({
        where: {
          pembelian_id: pembelian.pembelian_id,
          is_deleted: false
        },
        include: [
          {
            model: BarangHandmade,
            as: 'barang_handmade',
            attributes: ["nama_barang"]
          },
          {
            model: BarangNonHandmade,
            as: 'barang_non_handmade',
            attributes: ["nama_barang"]
          },
          {
            model: BarangCustom,
            as: 'barang_custom',
            attributes: ["nama_barang"]
          },
          {
            model: Packaging,
            as: 'packaging',
            attributes: ["nama_packaging"]
          },
          {
            model: Cabang,
            as: 'cabang',
            attributes: ["nama_cabang"]
          }
        ],
        raw: true,
        nest: true
      });

      return {
        pembelian_id: pembelian.pembelian_id,
        tanggal: pembelian.tanggal,
        total_pengeluaran: pembelian.total_pembelian,
        nama_toko: pembelian.toko.nama_toko,
        produk: produk.map(item => ({
          nama_barang: item.barang_handmade?.nama_barang ||
            item.barang_non_handmade?.nama_barang ||
            item.barang_custom?.nama_barang ||
            item.packaging?.nama_packaging,
          nama_cabang: item.cabang?.nama_cabang
        })),
        kategori_pengeluaran: "Pembelian"
      };
    }));

    const totalPengeluaran = [
      ...pengeluaran.map(item => item.jumlah_pengeluaran),
      ...transformedPembelian.map(item => item.total_pengeluaran)
    ].reduce((total, amount) => total + amount, 0);

    return {
      pengeluaran: [...transformedPengeluaran, ...transformedPembelian].sort((a, b) =>
        new Date(b.tanggal) - new Date(a.tanggal)
      ),
      total_pengeluaran: totalPengeluaran,
    };
  }

  static async getPengeluaranGudang(startDate = null, endDate = null) {
    const whereClause = {
      is_deleted: false
    };

    if (startDate && endDate) {
      whereClause.tanggal = {
        [Op.between]: [startDate, endDate]
      };
    }

    const pengeluaranWhereClause = {
      is_deleted: false,
      toko_id: 1
    };

    const pengeluaran = await DeskripsiPengeluaran.findAll({
      where: pengeluaranWhereClause,
      attributes: ['pengeluaran_id', 'deskripsi', 'jumlah_pengeluaran',],
      include: [
        {
          model: Pengeluaran,
          as: 'pengeluaran',
          where: whereClause,
          attributes: ['tanggal'],
          include: [
            {
              model: KategoriPengeluaran,
              as: 'kategori_pengeluaran',
              attributes: ["kategori_pengeluaran"]
            },
          ]
        },
        {
          model: Toko,
          as: 'toko',
          attributes: ["nama_toko"]
        },
      ],
      raw: true,
      nest: true
    });

    const transformedPengeluaran = pengeluaran.map(item => ({
      pengeluaran_id: item.pengeluaran_id,
      deskripsi: item.deskripsi,
      jumlah_pengeluaran: item.jumlah_pengeluaran,
      nama_toko: item.toko.nama_toko,
      kategori_pengeluaran: item.pengeluaran.kategori_pengeluaran.kategori_pengeluaran,
      tanggal: item.pengeluaran.tanggal
    }));

    const data = await PembelianGudang.findAll({
      where: {
        ...whereClause,
      },
      attributes: ['pembelian_id', 'tanggal', 'total_pembelian'],
      raw: true,
      nest: true
    });

    const transformedPembelian = await Promise.all(data.map(async (pembelian) => {
      const produk = await ProdukPembelianGudang.findAll({
        where: {
          pembelian_id: pembelian.pembelian_id,
          is_deleted: false
        },
        include: [
          {
            model: BarangHandmadeGudang,
            as: 'barang_handmade',
            attributes: ["nama_barang"]
          },
          {
            model: BarangNonHandmadeGudang,
            as: 'barang_nonhandmade',
            attributes: ["nama_barang"]
          },
          {
            model: BarangMentah,
            as: 'barang_mentah',
            attributes: ["nama_barang"],
          },
          {
            model: PackagingGudang,
            as: 'packaging',
            attributes: ["nama_packaging"]
          },
        ],
        raw: true,
        nest: true
      });

      return {
        pembelian_id: pembelian.pembelian_id,
        tanggal: pembelian.tanggal,
        total_pengeluaran: pembelian.total_pembelian,
        produk: produk.map(item => ({
          nama_barang: item.barang_handmade?.nama_barang ||
            item.barang_nonhandmade?.nama_barang ||
            item.barang_mentah?.nama_barang ||
            item.packaging?.nama_packaging,
        })),
        kategori_pengeluaran: "Pembelian"
      };
    }));

    const totalPengeluaran = [
      ...pengeluaran.map(item => item.jumlah_pengeluaran),
      ...transformedPembelian.map(item => item.total_pengeluaran)
    ].reduce((total, amount) => total + amount, 0);

    return {
      pengeluaran: [...transformedPengeluaran, ...transformedPembelian].sort((a, b) =>
        new Date(b.tanggal) - new Date(a.tanggal)
      ),
      total_pengeluaran: totalPengeluaran,
    };
  }
}

module.exports = LaporanKeuanganService;
