// models/seed.js  
const KategoriBarang = require('./kategoriBarang');
const JenisBarang = require('./jenisBarang');
const Packaging = require('./packaging');
const BarangNonHandmade = require('./barangNonHandmade');
const DivisiKaryawan = require('./divisiKaryawan');
const Karyawan = require('./karyawan');
const Kpi = require('./kpi');
const ProdukPenjualan = require('./produkPenjualan');
const Penjualan = require('./penjualan');
const MetodePembayaran = require('./metodePembayaran');
const Cabang = require('./cabang');
const Pembelian = require('./pembelian');
const JenisBarangGudang = require('./jenisBarangGudang');
const KategoriBarangGudang = require('./kategoriBarangGudang');
const BarangMentah = require('./barangMentah');
const BarangNonHandmadeGudang = require('./barangNonHandmadeGudang');
const RincianBiayaGudang = require('./rincianBiayaGudang');
const RincianBahanGudang = require('./rincianBahanGudang');
const MetodePembayaranGudang = require('./metodePembayaranGudang');
const PackagingGudang = require('./packagingGudang');
const PenjualanGudang = require('./penjualanGudang');
const PembelianGudang = require('./pembelianGudang');
const BiayaOperasionalStaffGudang = require('./biayaOperasionalStaffGudang');
const BiayaOperasionalProduksiGudang = require('./biayaOperasionalProduksiGudang');

const seedDatabase = async () => {
    try {
        // Seed data for JenisBarang  
        await JenisBarang.create({ jenis_barang_id: 1, nama_jenis_barang: "Handmade" });
        await JenisBarang.create({ jenis_barang_id: 2, nama_jenis_barang: "Non Handmade" });
        await JenisBarang.create({ jenis_barang_id: 3, nama_jenis_barang: "Custom" });
        await JenisBarang.create({ jenis_barang_id: 4, nama_jenis_barang: "Packaging" });

        // Seed data for JenisBarangGudang
        await JenisBarangGudang.create({ jenis_barang_gudang_id: 1, nama_jenis_barang: "Handmade" });

        // Seed data for KategoriBarang  
        await KategoriBarang.create({ kategori_barang_id: 1, nama_kategori_barang: "Gelang" });
        await KategoriBarang.create({ kategori_barang_id: 2, nama_kategori_barang: "Kalung" });

        // Seed data for KategoriBarangGudang
        await KategoriBarangGudang.create({ kategori_barang_id: 1, nama_kategori_barang: "Gelang" });
        await KategoriBarangGudang.create({ kategori_barang_id: 2, nama_kategori_barang: "Kalung" });

        // Seed data for Packaging  
        await Packaging.create({ packaging_id: 'PCK0001', nama_packaging: "Zipper", ukuran: "XL", jumlah_minimum_stok: 10, harga: 10, isi: 10, harga_satuan: 100, jenis_barang_id: 4, kategori_barang_id: 1 });
        await Packaging.create({ packaging_id: 'PCK0002', nama_packaging: "Kantong Kain", ukuran: "XL", jumlah_minimum_stok: 100, harga: 100, isi: 50, harga_satuan: 125, jenis_barang_id: 4, kategori_barang_id: 2 });

        // Seed data for BarangMentah
        await BarangMentah.create({ barang_mentah_id: 1, nama_barang: "Manik-Manik Huruf", jumlah_minimum_stok: 100, harga: 10, isi: 10, harga_satuan: 10 })

        // Seed data for BarangNonHandmade  
        await BarangNonHandmade.create({ barang_id: 1, nama_barang: "Gelang besi", kategori_barang_id: 1, jenis_barang_id: 1, jumlah_minimum_stok: 250, keuntungan: 100, harga_jual: 100, packaging_id: 1 });

        // Seed data for BarangNonHandmadeGudang  
        await BarangNonHandmadeGudang.create({ barang_id: 1, nama_barang: "Gelang besi", kategori_barang_id: 1, jenis_barang_id: 1, waktu_pengerjaan: 60, jumlah_minimum_stok: 250, total_hpp: 10, keuntungan: 100, harga_jual: 100 });

        //Seed data for RincianBiayaGudang 
        await RincianBiayaGudang.create({ rincian_biaya_id: 1, barang_id: 1, nama_biaya: "Biaya Operasional GOR. Haji Agus Salim", jumlah_biaya: 20})

        //Seed data for RincianBahanGudang
        await RincianBahanGudang.create({ rincian_bahan_id: 1, barang_mentah_id: 1, barang_id: 1, harga_satuan: 10, kuantitas: 5, total_biaya: 50 })

        //Seed data for MetodePembayaran
        await MetodePembayaran.create({ nama_metode: "BCA" })
        
        //Seed data for MetodePembayaran
        await MetodePembayaranGudang.create({ nama_metode: "BCA" })

        //Seed data for PackagingGudang
        await PackagingGudang.create({nama_packaging: "Zipper", ukuran: "Besar", jumlah_minimum_stok: 10, harga: 10, isi: 10, harga_satuan: 100})

        //Seed data for PenjualanGudang
        await PenjualanGudang.create({cash_or_non: true, metode_id: 1, nama_pembeli: "Pembueli", sub_total: 100, diskon: 20, pajak: 5, total_penjualan: 10})

        //Seed data for PembelianGudang
        await PembelianGudang.create({cash_or_non: true, metode_id: 1, sub_total: 100, diskon: 20, pajak: 5, total_penjualan: 10})

        //Seed data for BiayaOperasionalStaffGudang
        await BiayaOperasionalStaffGudang.create({nama_biaya: "Head", total_biaya: 1500000})

        //Seed data for BiayaOperasionalProduksiGudang
        await BiayaOperasionalProduksiGudang.create({nama_biaya: "Produksi", total_biaya: 1500000})

        // Seed data for Penjualan
        await Penjualan.create({
            tanggal_waktu: new Date(),
            nama_pembeli: "John Doe",
            cash_or_non: true,
            metode_pembayaran_id: 1,
            sub_total: 100000,
            diskon: 5000,
            pajak: 10000,
            total_penjualan: 105000
        });


        // Seed data for DivisiKaryawan  
        await DivisiKaryawan.create({ divisi_karyawan_id: 1, nama_divisi: "Produksi" });
        await DivisiKaryawan.create({ divisi_karyawan_id: 2, nama_divisi: "Pemasaran" });

        // Seed data for Cabang  
        await Cabang.create({ cabang_id: 1, nama_cabang: "Gor", email: "gor@gmail.com", password: 12345678 });
        await Cabang.create({ cabang_id: 2, nama_cabang: "Upi", email: "upi@gmail.com", password: 12345678 });

        // Seed data for Karyawan  
        await Karyawan.create({ karyawan_id: 1, nama_karyawan: "Budi", divisi_karyawan_id: 1, cabang_id: 1, cabang_id_first: 1, email: 'aa@gmail.com', password: '123', jumlah_gaji_pokok: 2000000, bonus: 250000, waktu_kerja_sebulan_menit: 806400 });
        await Karyawan.create({ karyawan_id: 2, nama_karyawan: "Siti", divisi_karyawan_id: 2, cabang_id: 2, cabang_id_first: 2, email: 'ab@gmail.com', password: '123', jumlah_gaji_pokok: 100, bonus: 250000, });

        // Seed data for Kpi  
        await Kpi.create({ divisi_karyawan_id: 1, nama_kpi: "Target Penjualan", persentase: 30, waktu: "Bulanan" });
        await Kpi.create({ divisi_karyawan_id: 1, nama_kpi: "Target Beli", persentase: 25, waktu: "Mingguan" });
        await Kpi.create({ divisi_karyawan_id: 1, nama_kpi: "Sikap", persentase: 10, waktu: "Harian" });

        // Pembelian
        await Pembelian.create({ metode_id: 1, sub_total: 100, metode_pembayaran_id: 1, diskon: 10, pajak: 10, total_penjualan: 10 });

        // Penjualan
        await Penjualan.create({ nama_pembeli: "Pembeli", metode_pembayaran_id: 1, sub_total: 10, diskon: 10, pajak: 10, total_penjualan: 10 })

        // Seed data for ProdukPenjualan  
        await ProdukPenjualan.create({ produk_penjualan_id: 1, penjualan_id: 1, barang_id: 1, kuantitas: 10, total_biaya: 100, cabang_id: 1 });

        console.log("Seed data created!");
    } catch (error) {
        console.error("Error seeding database:", error);
    }
};

module.exports = seedDatabase;  
