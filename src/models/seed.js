// models/seed.js  
const KategoriBarang = require('./kategoriBarang');
const JenisBarang = require('./jenisBarang');
const Packaging = require('./packaging');
const BarangHandmadeNon = require('./barangNonHandmade');
const DivisiKaryawan = require('./divisiKaryawan');
const Karyawan = require('./karyawan');
const Kpi = require('./kpi');
const ProdukPenjualan = require('./produkPenjualan');
const Penjualan = require('./penjualan');
const MetodePembayaran = require('./metodePembayaran');
const Cabang = require('./cabang');
const Pembelian = require('./pembelian');

const seedDatabase = async () => {
    try {
        // Seed data for KategoriBarang  
        await KategoriBarang.create({ kategori_barang_id: 1, nama_kategori_barang: "Handmade" });

        // Seed data for JenisBarang  
        await JenisBarang.create({ jenis_barang_id: 1, jenis_barang: "Kerajinan Tangan" });
        await JenisBarang.create({ jenis_barang_id: 2, jenis_barang: "Aksesoris" });

        // Seed data for Packaging  
        await Packaging.create({ packaging_id: 1, nama_packaging: "Kotak Kayu", ukuran: "XL", jumlah_minimum_stok: 10, harga: 10, isi: 10, harga_satuan: 100, kategori_barang_id: 1 });
        await Packaging.create({ packaging_id: 2, nama_packaging: "Kantong Kain", ukuran: "Besar", jumlah_minimum_stok: 100, harga: 100, isi: 50, harga_satuan: 125, kategori_barang_id: 1 });

        // Seed data for BarangHandmadeNon  
        await BarangHandmadeNon.create({ barang_id: 1, nama_barang: "Lukisan", kategori_barang_id: 1, jenis_barang_id: 1, packaging_id: 1 });
        await BarangHandmadeNon.create({ barang_id: 2, nama_barang: "Gelang", kategori_barang_id: 1, jenis_barang_id: 2, packaging_id: 2 });

        await MetodePembayaran.create({ nama_metode: "BCA" })
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
        await Karyawan.create({ karyawan_id: 1, nama_karyawan: "Budi", divisi_karyawan_id: 1, cabang_id: 1, cabang_id_first: 1, email: 'aa@gmail.com', password: '123', jumlah_gaji_pokok: 100, bonus: 250000, });
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
        await ProdukPenjualan.create({ produk_penjualan_id: 2, penjualan_id: 1, barang_id: 2, kuantitas: 5, total_biaya: 200, cabang_id: 2 });

        console.log("Seed data created!");
    } catch (error) {
        console.error("Error seeding database:", error);
    }
};

module.exports = seedDatabase;  
