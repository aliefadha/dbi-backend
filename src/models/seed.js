// models/seed.js  
const KategoriBarang = require('./kategoriBarang');
const JenisBarang = require('./jenisBarang');
const Packaging = require('./packaging');
const DivisiKaryawan = require('./divisiKaryawan');
const Karyawan = require('./karyawan');
const Kpi = require('./kpi');
const MetodePembayaran = require('./metodePembayaran');
const Cabang = require('./cabang');
const JenisBarangGudang = require('./jenisBarangGudang');
const KategoriBarangGudang = require('./kategoriBarangGudang');
const BarangMentah = require('./barangMentah');
const MetodePembayaranGudang = require('./metodePembayaranGudang');
const BiayaOperasionalStaffGudang = require('./biayaOperasionalStaffGudang');
const BiayaOperasionalProduksiGudang = require('./biayaOperasionalProduksiGudang');
const BiayaGudang = require('./biayaGudang');
const Authentication = require('./authentication');
const barangMentah = require('../../seeder/barangMentah.json');
const barangHandmadeGudang = require('../../seeder/barangHandmadeGudang.json');
const packagingGudang = require('../../seeder/packagingGudang.json');
const barangNonHandmadeGudang = require('../../seeder/barangNonHandmadeGudang.json');
const biayaToko = require('../../seeder/biayaToko.json');
const pembelianGudang = require('../../seeder/pembelianGudang.json');
const CustomIdGenerateService = require('../services/customIdGenerateService');
const RincianBahanGudang = require('./rincianBahanGudang');
const BarangHandmadeGudang = require('./barangHandmadeGudang');
const RincianBiayaGudangService = require('../services/rincianBiayaGudangService');
const BarangNonHandmadeGudang = require('./barangNonHandmadeGudang');
const BiayaTokoService = require('../services/biayaTokoService');
const PackagingGudangService = require('../services/packagingGudangService');
const PembelianGudangService = require('../services/pembelianGudangService');
const Toko = require('./toko');
const KategoriPengeluaran = require('./kategoriPengeluaran');
const KategoriPemasukan = require('./kategoriPemasukan');

const seedDatabase = async () => {
    try {
        // Seed data for JenisBarang  
        await JenisBarang.create({ jenis_barang_id: 1, nama_jenis_barang: "Handmade" });
        await JenisBarang.create({ jenis_barang_id: 2, nama_jenis_barang: "Non Handmade" });
        await JenisBarang.create({ jenis_barang_id: 3, nama_jenis_barang: "Custom" });
        await JenisBarang.create({ jenis_barang_id: 4, nama_jenis_barang: "Packaging" });

        // Seed data for JenisBarangGudang
        await JenisBarangGudang.create({ jenis_barang_gudang_id: 1, nama_jenis_barang: "Handmade" });
        await JenisBarangGudang.create({ jenis_barang_gudang_id: 2, nama_jenis_barang: "Non Handmade" });
        await JenisBarangGudang.create({ jenis_barang_gudang_id: 3, nama_jenis_barang: "Mentah" });

        // Seed data for KategoriBarang  
        await KategoriBarang.create({ kategori_barang_id: 1, nama_kategori_barang: "Gelang" });
        await KategoriBarang.create({ kategori_barang_id: 2, nama_kategori_barang: "Kalung" });

        // Seed data for KategoriBarangGudang
        await KategoriBarangGudang.create({ kategori_barang_id: 1, nama_kategori_barang: "Gelang" });
        await KategoriBarangGudang.create({ kategori_barang_id: 2, nama_kategori_barang: "Kalung" });

        // Seed data for Packaging  
        await Packaging.create({ packaging_id: 'PCK0001', nama_packaging: "Zipper", ukuran: "XL", jumlah_minimum_stok: 10, harga: 10, isi: 10, harga_satuan: 100, jenis_barang_id: 4, kategori_barang_id: 1 });
        await Packaging.create({ packaging_id: 'PCK0002', nama_packaging: "Kantong Kain", ukuran: "XL", jumlah_minimum_stok: 100, harga: 100, isi: 50, harga_satuan: 125, jenis_barang_id: 4, kategori_barang_id: 2 });

        //Seed data for MetodePembayaran
        await MetodePembayaran.create({ nama_metode: "BCA" })

        //Seed data for MetodePembayaran
        await MetodePembayaranGudang.create({ nama_metode: "BCA" })
        await MetodePembayaranGudang.create({ nama_metode: "MANDIRI" })

        //Seed data for biaya gudang
        await BiayaGudang.create({
            total: 5000000,
            rata_rata: 2500000,
            total_biaya: 3000000,
            waktu_kerja: 160,
            total_modal: 10000000
        })

        await BiayaOperasionalProduksiGudang.create({
            biaya_gudang_id: 1,
            nama_biaya: "Operasional",
            total_biaya: 2000000,
            biaya_gudang_id: 1
        })

        await BiayaOperasionalStaffGudang.create({
            biaya_gudang_id: 1,
            nama_biaya: "Staff",
            total_biaya: 1000000,
            biaya_gudang_id: 1
        })

        //Seed for kategori pengeluaran
        await KategoriPengeluaran.create({kategori_pengeluaran: "Pembelian"})
        await KategoriPengeluaran.create({kategori_pengeluaran: "Beban Listrik"})

        //Seed for kategori pemasukan
        await KategoriPemasukan.create({kategori_pemasukan: "Penjualan"})
        await KategoriPemasukan.create({kategori_pemasukan: "Hibah"})



        // Seed data for Penjualan
        // await Penjualan.create({
        //     tanggal_waktu: new Date(),
        //     nama_pembeli: "John Doe",
        //     cash_or_non: true,
        //     metode_pembayaran_id: 1,
        //     sub_total: 100000,
        //     diskon: 5000,
        //     pajak: 10000,
        //     total_penjualan: 105000
        // });


        // Seed data for DivisiKaryawan  
        await DivisiKaryawan.create({ divisi_karyawan_id: 1, nama_divisi: "Produksi" });
        await DivisiKaryawan.create({ divisi_karyawan_id: 2, nama_divisi: "Pemasaran" });

        // Seed data for Toko
        await Toko.create({nama_toko: "Tatitatu", email: "tatitatu@gmail.com", password: 12345678});
        await Toko.create({nama_toko: "Gudang", email: "gudang@gmail.com", password: 12345678});

        // Seed data for Cabang  
        await Cabang.create({ cabang_id: 1, toko_id: 1, nama_cabang: "Gor", email: "gor@gmail.com", password: 12345678 });
        await Cabang.create({ cabang_id: 2, toko_id: 1, nama_cabang: "Upi", email: "upi@gmail.com", password: 12345678 });
        await Cabang.create({ cabang_id: 3, toko_id: 1, nama_cabang: "Taplau", email: "taplau@gmail.com", password: 12345678 });
        await Cabang.create({ cabang_id: 4, toko_id: 1, nama_cabang: "Gunung Pangilun", email: "gpangilung@gmail.com", password: 12345678 });
        await Cabang.create({ cabang_id: 5, toko_id: 1, nama_cabang: "Soetomo", email: "soetomo@gmail.com", password: 12345678 });

        // Seed data for Karyawan  
        await Karyawan.create({ karyawan_id: 1, nama_karyawan: "Budi", divisi_karyawan_id: 1, cabang_id: 1, cabang_id_first: 1, email: 'aa@gmail.com', password: '123', jumlah_gaji_pokok: 2000000, bonus: 250000, waktu_kerja_sebulan_menit: 806400 });
        await Karyawan.create({ karyawan_id: 2, nama_karyawan: "Siti", divisi_karyawan_id: 2, cabang_id: 2, cabang_id_first: 2, email: 'ab@gmail.com', password: '123', jumlah_gaji_pokok: 100, bonus: 250000, });

        // Seed data for Kpi  
        await Kpi.create({ divisi_karyawan_id: 1, nama_kpi: "Target Penjualan", persentase: 30, waktu: "Bulanan" });
        await Kpi.create({ divisi_karyawan_id: 1, nama_kpi: "Target Beli", persentase: 25, waktu: "Mingguan" });
        await Kpi.create({ divisi_karyawan_id: 1, nama_kpi: "Sikap", persentase: 10, waktu: "Harian" });

        // Pembelian
        // await Pembelian.create({ metode_id: 1, sub_total: 100, metode_pembayaran_id: 1, diskon: 10, pajak: 10, total_penjualan: 10 });

        // // Penjualan
        // await Penjualan.create({ nama_pembeli: "Pembeli", metode_pembayaran_id: 1, sub_total: 10, diskon: 10, pajak: 10, total_penjualan: 10 })

        // Authentication
        await Authentication.create({ email: "owner@gmail.com", password: 12345678 });
        await Authentication.create({ email: "finance@gmail.com", password: 12345678 });
        await Authentication.create({ email: "manager@gmail.com", password: 12345678 });
        await Authentication.create({ email: "headgudang@gmail.com", password: 12345678 });
        await Authentication.create({ email: "admingudang@gmail.com", password: 12345678 });

        // Proper seed barang mentah
        for (const item of barangMentah) {
            const barangMentahId = await CustomIdGenerateService.generateBarangMentahId();
            await BarangMentah.create({
                barang_mentah_id: barangMentahId,
                nama_barang: item.nama_barang,
                harga: item.harga,
                jumlah_minimum_stok: item.jumlah_minimum_stok,
                harga_satuan: item.harga_satuan,
                isi: item.isi,
                is_deleted: item.is_deleted
            });
        }

        // Proper seed barang handmade
        for (const item of barangHandmadeGudang) {
            const barangHandmadeId = await CustomIdGenerateService.generateBarangHandmadeGudangId();

            await BarangHandmadeGudang.create({
                barang_handmade_id: barangHandmadeId,
                nama_barang: item.nama_barang,
                image: null,
                kategori_barang_id: item.kategori_barang_id,
                jumlah_minimum_stok: item.jumlah_minimum_stok,
                waktu_pengerjaan: item.waktu_pengerjaan,
                keuntungan: item.keuntungan,
                harga_jual: item.harga_jual,
                total_hpp: item.total_hpp,
                is_deleted: false
            });

            // Create rincian bahan
            for (const bahan of item.rincian_bahan) {
                await RincianBahanGudang.create({
                    barang_handmade_id: barangHandmadeId,
                    ...bahan
                });
            }

            await RincianBiayaGudangService.createMany([
                {
                    barang_handmade_id: barangHandmadeId,
                    nama_biaya: "Biaya Operasional dan Staff",
                    jumlah_biaya: 10000000
                },
                {
                    barang_handmade_id: barangHandmadeId,
                    nama_biaya: "Biaya Operasional Produksi",
                    jumlah_biaya: 3000000
                }
            ]);
        }

        // Proper seed barang non-handmade
        for (const item of barangNonHandmadeGudang) {
            const barangNonHandmadeId = await CustomIdGenerateService.generateBarangNonHandmadeGudangId();
            
            await BarangNonHandmadeGudang.create({
                barang_nonhandmade_id: barangNonHandmadeId,
                nama_barang: item.nama_barang,
                image: null,
                kategori_barang_id: item.kategori_barang_id,
                jumlah_minimum_stok: item.jumlah_minimum_stok,
                harga: item.harga,
                total_hpp: item.total_hpp,
                keuntungan: item.keuntungan,
                harga_jual: item.harga_jual,
                is_deleted: false
            });

            await RincianBiayaGudangService.createMany([
                {
                    barang_nonhandmade_id: barangNonHandmadeId,
                    nama_biaya: "Biaya Operasional dan Staff",
                    jumlah_biaya: 10000000
                },
                {
                    barang_nonhandmade_id: barangNonHandmadeId,
                    nama_biaya: "Biaya Operasional Produksi",
                    jumlah_biaya: 3000000
                },
                ...item.rincian_biaya.map(bahan => ({
                    barang_nonhandmade_id: barangNonHandmadeId,
                    ...bahan
                }))
            ]);
        }

        for(const item of packagingGudang) {
            const newId = await CustomIdGenerateService.generatePackagingGudangId();
            await PackagingGudangService.create({
                ...item,
                packaging_id: newId,
                image: null
            })
        }

        for(const item of biayaToko) {
            await BiayaTokoService.create({
                ...item
            })
        }

        for(const item of pembelianGudang) {
            const newId = await CustomIdGenerateService.generatePembelianGudangId();
            await PembelianGudangService.create({
                ...item,
                pembelian_id: newId
              });
        }



        console.log("Seed data created!");
    } catch (error) {
        console.error("Error seeding database:", error);
    }
};

module.exports = seedDatabase;
