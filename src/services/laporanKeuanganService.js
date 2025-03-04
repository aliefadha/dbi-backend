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
const RincianGaji = require("../models/rincianGaji");
const Karyawan = require("../models/karyawan");
const BayarGaji = require("../models/bayarGaji");
const XLSX = require('xlsx');

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

  static async getAll(toko_id = null, cabang_id = null, startDate = null, endDate = null, kategori_pemasukan_id = null, kategori_pengeluaran_id = null) {
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

    const namaGudang = await Toko.findOne({
      where: {
        toko_id: 1
      },
      attributes: ["nama_toko"]
    });

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
              ...(kategori_pengeluaran_id && {
                where: { kategori_pengeluaran_id: kategori_pengeluaran_id }
              }),
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
          attributes: ["nama_cabang"],
          ...(cabang_id && {
            where: {
              cabang_id: cabang_id
            }
          })
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

    const gudangData = !toko_id ? await PembelianGudang.findAll({
      where: {
        ...whereClause,
      },
      attributes: ['pembelian_id', 'tanggal', 'total_pembelian'],
      raw: true,
      nest: true
    }) : [];

    const transformedPembelian = await Promise.all([
      ...data.map(async (pembelian) => {
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
              attributes: ["nama_cabang"],
              ...(cabang_id && {
                where: {
                  cabang_id: cabang_id
                }
              })
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
      }),
      ...(!toko_id ? gudangData.map(async (pembelian) => {
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
          nama_toko: namaGudang,
          produk: produk.map(item => ({
            nama_barang: item.barang_handmade?.nama_barang ||
              item.barang_nonhandmade?.nama_barang ||
              item.barang_mentah?.nama_barang ||
              item.packaging?.nama_packaging,
          })),
          kategori_pengeluaran: "Pembelian"
        };
      }) : [])
    ]);

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
              ...(kategori_pemasukan_id && {
                where: { kategori_pemasukan_id: kategori_pemasukan_id }
              }),
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
          attributes: ["nama_cabang"],
          ...(cabang_id && {
            where: {
              cabang_id: cabang_id
            }
          })
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

    const penjualanGudangData = !toko_id? await PenjualanGudang.findAll({
      where: {
       ...whereClause,
      },
      attributes: ['penjualan_id', 'tanggal', 'total_penjualan'],
      raw: true,
      nest: true
    }) : [];

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

    const transformedPenjualan = await Promise.all([
      ...penjualanData.map(async (penjualan) => {
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
              attributes: ["nama_cabang"],
              ...(cabang_id && {
                where: {
                  cabang_id: cabang_id
                }
              })
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
      }),
      ...(!toko_id ? penjualanGudangData.map(async (penjualan) => {
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
          nama_toko: namaGudang,
          produk: produk.map(item => ({
            nama_barang: item.barang_handmade?.nama_barang ||
              item.barang_nonhandmade?.nama_barang ||
              item.barang_mentah?.nama_barang ||
              item.packaging?.nama_packaging,
          })),
          kategori_pemasukan: "Penjualan"
        };
      }) : [])
    ]);

    const gajiData = await RincianGaji.findAll({
      attributes: ['bayar_gaji_id', 'total_gaji_akhir'],
      include: [
        {
          model: Karyawan,
          as: 'karyawan',
          attributes: ["nama_karyawan"],
          where: {
            is_deleted: false,
            ...(toko_id && { toko_id: toko_id })
          },
          include: [
            {
              model: Toko,
              as: "toko",
              attributes: ["nama_toko"],
            },
            {
              model: Cabang,
              as: 'cabang',
              attributes: ["nama_cabang"],
              ...(cabang_id && {
                where: {
                  cabang_id: cabang_id
                }
              })
            }
          ]
        },
        {
          model: BayarGaji,
          where: {
            is_deleted: false,
            ...(startDate && endDate && {
              tanggal: {
                [Op.between]: [startDate, endDate]
              }
            })
          },
          as: "bayar_gaji"
        }
      ],
      raw: true,
      nest: true
    })

    const transformedGaji = gajiData.map(item => ({
      pengeluaran_id: item.bayar_gaji_id,
      deskripsi: 'Gaji Karyawan',
      jumlah_pengeluaran: item.total_gaji_akhir,
      nama_toko: item.karyawan.toko.nama_toko,
      nama_cabang: item.karyawan.cabang.nama_cabang,
      kategori_pengeluaran: "Gaji",
      tanggal: item.bayar_gaji.tanggal
    }));

    

    const totalPemasukan = [
      ...transformedPemasukan.map(item => item.jumlah_pemasukan),
      ...(parseInt(kategori_pemasukan_id) === 1 || (!kategori_pengeluaran_id && !kategori_pemasukan_id)
        ? transformedPenjualan.map(item => item.total_pemasukan)
        : [])
    ].reduce((total, amount) => total + amount, 0);

    const totalPengeluaran = [
      ...pengeluaran.map(item => item.jumlah_pengeluaran),
      ...(parseInt(kategori_pengeluaran_id) === 1 || (!kategori_pengeluaran_id && !kategori_pemasukan_id)
        ? transformedPembelian.map(item => item.total_pengeluaran)
        : []),
      ...(parseInt(kategori_pengeluaran_id) === 2 || (!kategori_pengeluaran_id && !kategori_pemasukan_id)
        ? transformedGaji.map(item => item.jumlah_pengeluaran)
        : [])
    ].reduce((total, amount) => total + amount, 0);

    const laporan = {
      ...((!kategori_pemasukan_id) && {
        pengeluaran: [
          ...transformedPengeluaran,
          ...(parseInt(kategori_pengeluaran_id) === 1 || (!kategori_pengeluaran_id && !kategori_pemasukan_id)
            ? transformedPembelian
            : []),
          ...(parseInt(kategori_pengeluaran_id) === 2 || (!kategori_pengeluaran_id && !kategori_pemasukan_id)
            ? transformedGaji
            : []),
        ].sort((a, b) => new Date(a.tanggal) - new Date(b.tanggal))
      }),
      ...((!kategori_pengeluaran_id) && {
        pemasukan: [...transformedPemasukan,
        ...(parseInt(kategori_pemasukan_id) === 1 || (!kategori_pengeluaran_id && !kategori_pemasukan_id)
          ? transformedPenjualan
          : [])
        ].sort((a, b) =>
          new Date(a.tanggal) - new Date(b.tanggal)
        )
      }),
      total_pemasukan: totalPemasukan,
      total_pengeluaran: totalPengeluaran,
      keuntungan: totalPemasukan - totalPengeluaran,
      produk_terjual: (parseInt(kategori_pemasukan_id) === 1 || (!kategori_pengeluaran_id && !kategori_pemasukan_id)
        ? transformedPenjualan.reduce((total, item) => total + item.produk.length, 0)
        : 0),
    }
    return laporan;
  }

  static async getGudang(startDate = null, endDate = null, kategori_pemasukan_id = null, kategori_pengeluaran_id = null) {
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
              ...(kategori_pengeluaran_id && {
                where: { kategori_pengeluaran_id: kategori_pengeluaran_id }
              }),
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
              ...(kategori_pemasukan_id && {
                where: { kategori_pemasukan_id: kategori_pemasukan_id }
              }),
              attributes: ["kategori_pemasukan"],
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

    const gajiData = await RincianGaji.findAll({
      attributes: ['bayar_gaji_id', 'total_gaji_akhir'],
      include: [
        {
          model: BayarGaji,
          as: "bayar_gaji",
          attributes: ["tanggal"],
          where: whereClause
        },
        {
          model: Karyawan,
          as: 'karyawan',
          attributes: ["nama_karyawan"],
          where: {
            is_deleted: false,
            toko_id: 1
          },
          include: [
            {
              model: Toko,
              as: "toko",
              attributes: ["nama_toko"],
            },
            {
              model: Cabang,
              as: 'cabang',
              attributes: ["nama_cabang"],
            }
          ]
        }
      ],
      raw: true,
      nest: true
    })

    const transformedGaji = gajiData.map(item => ({
      pengeluaran_id: item.bayar_gaji_id,
      deskripsi: 'Gaji Karyawan',
      jumlah_pengeluaran: item.total_gaji_akhir,
      nama_toko: item.karyawan.toko.nama_toko,
      nama_cabang: item.karyawan.cabang.nama_cabang,
      kategori_pengeluaran: "Gaji",
      tanggal: item.bayar_gaji.tanggal
    }));

    const totalPemasukan = [
      ...transformedPemasukan.map(item => item.jumlah_pemasukan),
      ...(parseInt(kategori_pemasukan_id) === 1 || (!kategori_pengeluaran_id && !kategori_pemasukan_id)
        ? transformedPenjualan.map(item => item.total_pemasukan)
        : [])
    ].reduce((total, amount) => total + amount, 0);

    const totalPengeluaran = [
      ...pengeluaran.map(item => item.jumlah_pengeluaran),
      ...(parseInt(kategori_pengeluaran_id) === 1 || (!kategori_pengeluaran_id && !kategori_pemasukan_id)
        ? transformedPembelian.map(item => item.total_pengeluaran)
        : []),
      ...(parseInt(kategori_pengeluaran_id) === 2 || (!kategori_pengeluaran_id && !kategori_pemasukan_id)
        ? transformedGaji.map(item => item.jumlah_pengeluaran)
        : [])
    ].reduce((total, amount) => total + amount, 0);

   const laporan = {
      ...((!kategori_pemasukan_id) && {
        pengeluaran: [
          ...transformedPengeluaran,
          ...(parseInt(kategori_pengeluaran_id) === 1 || (!kategori_pengeluaran_id && !kategori_pemasukan_id)
            ? transformedPembelian
            : []),
          ...(parseInt(kategori_pengeluaran_id) === 2 || (!kategori_pengeluaran_id && !kategori_pemasukan_id)
            ? transformedGaji
            : []),
        ].sort((a, b) => new Date(a.tanggal) - new Date(b.tanggal))
      }),
      ...((!kategori_pengeluaran_id) && {
        pemasukan: [...transformedPemasukan,
        ...(parseInt(kategori_pemasukan_id) === 1 || (!kategori_pengeluaran_id && !kategori_pemasukan_id)
          ? transformedPenjualan
          : [])
        ].sort((a, b) =>
          new Date(a.tanggal) - new Date(b.tanggal)
        )
      }),
      total_pemasukan: totalPemasukan,
      total_pengeluaran: totalPengeluaran,
      keuntungan: totalPemasukan - totalPengeluaran,
      produk_terjual: (parseInt(kategori_pemasukan_id) === 1 || (!kategori_pengeluaran_id && !kategori_pemasukan_id)
        ? transformedPenjualan.reduce((total, item) => total + item.produk.length, 0)
        : 0),
    }

    return laporan
  }

  static async getAllPemasukan(toko_id = null, cabang_id = null, startDate = null, endDate = null) {
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
          attributes: ["nama_cabang"],
          ...(cabang_id && {
            where: { cabang_id: cabang_id }
          })
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
            attributes: ["nama_cabang"],
            ...(cabang_id && {
              where: { cabang_id: cabang_id }
            })
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

  static async getAllPengeluaran(toko_id = null, cabang_id = null, startDate = null, endDate = null) {
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
          attributes: ["nama_cabang"],
          ...(cabang_id && {
            where: { cabang_id: cabang_id }
          })
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
            attributes: ["nama_cabang"],
            ...(cabang_id && {
              where: { cabang_id: cabang_id }
            })
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

    const gajiData = await RincianGaji.findAll({
      attributes: ['bayar_gaji_id', 'total_gaji_akhir'],
      include: [
        {
          model: Karyawan,
          as: 'karyawan',
          attributes: ["nama_karyawan"],
          where: {
            is_deleted: false,
            ...(toko_id && { toko_id: toko_id })
          },
          include: [
            {
              model: Toko,
              as: "toko",
              attributes: ["nama_toko"],
            },
            {
              model: Cabang,
              as: 'cabang',
              attributes: ["nama_cabang"],
              ...(cabang_id && {
                where: { cabang_id: cabang_id }
              })
            }
          ]
        },
        {
          model: BayarGaji,
          as: "bayar_gaji"
        }
      ],
      raw: true,
      nest: true
    })

    const transformedGaji = gajiData.map(item => ({
      pengeluaran_id: item.bayar_gaji_id,
      deskripsi: 'Gaji Karyawan',
      jumlah_pengeluaran: item.total_gaji_akhir,
      nama_toko: item.karyawan.toko.nama_toko,
      nama_cabang: item.karyawan.cabang.nama_cabang,
      kategori_pengeluaran: "Gaji",
      tanggal: item.bayar_gaji.tanggal
    }));

    const totalPengeluaran = [
      ...pengeluaran.map(item => item.jumlah_pengeluaran),
      ...transformedPembelian.map(item => item.total_pengeluaran),
     ...transformedGaji.map(item => item.jumlah_pengeluaran)
    ].reduce((total, amount) => total + amount, 0);

    return {
      pengeluaran: [...transformedPengeluaran, ...transformedPembelian, ...transformedGaji].sort((a, b) =>
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

    const gajiData = await RincianGaji.findAll({
      attributes: ['bayar_gaji_id', 'total_gaji_akhir'],
      include: [
        {
          model: BayarGaji,
          as: "bayar_gaji",
          attributes: ["tanggal"]
        },
        {
          model: Karyawan,
          as: 'karyawan',
          attributes: ["nama_karyawan"],
          where: {
            is_deleted: false,
            toko_id: 1
          },
          include: [
            {
              model: Toko,
              as: "toko",
              attributes: ["nama_toko"],
            },
            {
              model: Cabang,
              as: 'cabang',
              attributes: ["nama_cabang"],
            }
          ]
        }
      ],
      raw: true,
      nest: true
    })

    const transformedGaji = gajiData.map(item => ({
      pengeluaran_id: item.bayar_gaji_id,
      deskripsi: 'Gaji Karyawan',
      jumlah_pengeluaran: item.total_gaji_akhir,
      nama_toko: item.karyawan.toko.nama_toko,
      nama_cabang: item.karyawan.cabang.nama_cabang,
      kategori_pengeluaran: "Gaji",
      tanggal: item.bayar_gaji.tanggal
    }));

    const totalPengeluaran = [
      ...pengeluaran.map(item => item.jumlah_pengeluaran),
      ...transformedPembelian.map(item => item.total_pengeluaran),
    ...transformedGaji.map(item => item.jumlah_pengeluaran)
    ].reduce((total, amount) => total + amount, 0);

    return {
      pengeluaran: [...transformedPengeluaran, ...transformedPembelian, ...transformedGaji].sort((a, b) =>
        new Date(b.tanggal) - new Date(a.tanggal)
      ),
      total_pengeluaran: totalPengeluaran,
    };
  }

  static async exportToExcel(toko_id, startDate, endDate, kategori_pemasukan_id, kategori_pengeluaran_id) {
    const result = await (toko_id == 1 ? this.getGudang(startDate, endDate, kategori_pemasukan_id, kategori_pengeluaran_id) : this.getAll(toko_id, startDate, endDate, kategori_pemasukan_id, kategori_pengeluaran_id));

    // Fungsi untuk format ke Rupiah
    const formatRupiah = (angka) => {
        if (angka === undefined || angka === null) return "Rp 0"; // Handle undefined/null
        return `Rp ${Number(angka).toLocaleString("id-ID")}`;
    };

    // Prepare the summary row (Keuntungan, Pemasukan, Pengeluaran, Produk Terjual) dalam format Rp
    const summaryRow = [
      ["Keuntungan", formatRupiah(result.keuntungan), 
       "Pemasukan", formatRupiah(result.total_pemasukan), 
       "Pengeluaran", formatRupiah(result.total_pengeluaran), 
       "Produk Terjual", result.produk_terjual]
    ];

    // Prepare the table headers
    const headers = [
        ["Nomor", "Tanggal", "Deskripsi", "Toko", "Kategori", "Total"]
    ];

    // Format pemasukan data dengan Rupiah
    if(result.pemasukan == null) result.pemasukan = [];
    const pemasukanData = result.pemasukan.map(item => [
        item.pemasukan_id ?? item.penjualan_id,
        item.tanggal,
        item.deskripsi ?? item.produk.map(produk => produk.nama_barang).join(", "),
        item.nama_toko ?? "-",
        item.kategori_pemasukan,
        formatRupiah(item.jumlah_pemasukan ?? item.total_pemasukan) // Konversi ke format Rp
    ]);
  
    // Format pengeluaran data dengan Rupiah
    if(result.pengeluaran == null) result.pengeluaran = [];
    const pengeluaranData = result.pengeluaran.map(item => [
        item.pengeluaran_id ?? item.pembelian_id,
        item.tanggal,
        item.deskripsi ?? item.produk.map(produk => produk.nama_barang).join(", "),
        item.nama_toko ?? "-",
        item.kategori_pengeluaran,
        formatRupiah(item.jumlah_pengeluaran ?? item.total_pengeluaran) // Konversi ke format Rp
    ]);

    // Combine data for the final Excel sheet
    const finalData = [
        ...summaryRow,   // Add summary row
        [],              // Empty row for spacing
        ...headers,      // Add table headers
        ...pemasukanData, // Add pemasukan data
        ...pengeluaranData // Add pengeluaran data
    ];

    // Create a new workbook and worksheet
    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.aoa_to_sheet(finalData); // Convert array to worksheet

    // Append worksheet to workbook
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Laporan Keuangan');

    return workbook;
  }

}

module.exports = LaporanKeuanganService;
