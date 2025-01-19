// models/seed.js  
const KategoriBarang = require('./kategoriBarang');
const JenisBarang = require('./jenisBarang');
const Packaging = require('./packaging');
const DivisiKaryawan = require('./divisiKaryawan');
const Karyawan = require('./karyawan');
const Kpi = require('./kpi');
const MetodePembayaran = require('./metodePembayaran');
const Cabang = require('./cabang');
const Barang = require('./barang');
const Bundling = require('./bundling');
const Addons = require('./addons');

const seedDatabase = async () => {
    try {
        // Seed data for KategoriBarang  
        await JenisBarang.create({ jenis_barang_id: 1, nama_jenis_barang: "Handmade" });
        await JenisBarang.create({ jenis_barang_id: 2, nama_jenis_barang: "Non Handmade" });
        await JenisBarang.create({ jenis_barang_id: 3, nama_jenis_barang: "Custom" });
        await JenisBarang.create({ jenis_barang_id: 4, nama_jenis_barang: "Mentah" });

        // Seed data for JenisBarang  
        await KategoriBarang.create({ kategori_barang_id: 1, nama_kategori_barang: "Gelang" });
        await KategoriBarang.create({ kategori_barang_id: 2, nama_kategori_barang: "Kalung" });

        // Seed data for Packaging  
        await Packaging.create({ packaging_id: 1, kategori_barang_id: 1, nama_packaging: "Zipper", ukuran: "XL", jumlah_minimum_stok: 10, harga: 10, isi: 10, harga_satuan: 100, jenis_barang_id: 1 });
        await Packaging.create({ packaging_id: 2, kategori_barang_id: 2, nama_packaging: "Kantong Kain", ukuran: "XL", jumlah_minimum_stok: 100, harga: 100, isi: 50, harga_satuan: 125, jenis_barang_id: 1 });

        // Seed data for Barang Handmade  
        await Barang.create({ barang_id: 1, kategori_barang_id: 1, jenis_barang_id: 1, nama_barang: "Gelang besi", jumlah_minimum_stok: 250, harga: 0, isi: 0, harga_satuan: 0 });

        // Seed data for Barang NonHandmade  
        await Barang.create({ barang_id: 2, kategori_barang_id: 2, jenis_barang_id: 2, nama_barang: "Kalung karet", jumlah_minimum_stok: 250, harga: 0, isi: 0, harga_satuan: 0 });

        // Seed data for Barang Custom  
        await Barang.create({ barang_id: 3, kategori_barang_id: 1, jenis_barang_id: 3, nama_barang: "Gelang gelangan", jumlah_minimum_stok: 250, harga: 100, isi: 10, harga_satuan: 10 });

        // Seed data for Metode Pembayaran
        await MetodePembayaran.create({ nama_metode: "BCA" })

        // Seed data for Cabang  
        await Cabang.create({ cabang_id: 1, nama_cabang: "Gor", email: "gor@gmail.com", password: 12345678 });
        await Cabang.create({ cabang_id: 2, nama_cabang: "Upi", email: "upi@gmail.com", password: 12345678 });

        // Seed data for Bundling
        await Bundling.create({barang_id: 1, cabang_id: 1, total_hpp: 100, keuntungan: 100, harga_jual: 100});

        // Seed data for RincianBiaya
        await Addons.create({ jenis_addons: 'Rincian Biaya', nama_addons: "Biaya Operasional GOR. Haji Agus Salim", harga_satuan : 10000, kuantitas: 1, total_biaya: 10000, bundling_id: 1 });
        await Addons.create({ jenis_addons: 'Rincian Biaya', nama_addons: "Biaya Staff GOR. Haji Agus Salim", harga_satuan : 10000, kuantitas: 1, total_biaya: 10000, bundling_id: 1 });
        
        // Seed for Packaging
        await Addons.create({ jenis_addons: 'Packaging', nama_addons: "Zipper", harga_satuan : 100, kuantitas: 10, total_biaya: 1000, packaging_id:1, bundling_id: 1 });


        // Seed data for DivisiKaryawan  
        await DivisiKaryawan.create({ divisi_karyawan_id: 1, nama_divisi: "Produksi" });
        await DivisiKaryawan.create({ divisi_karyawan_id: 2, nama_divisi: "Pemasaran" });

        // Seed data for Karyawan  
        await Karyawan.create({ karyawan_id: 1, nama_karyawan: "Budi", divisi_karyawan_id: 1, cabang_id: 1, cabang_id_first: 1, email: 'aa@gmail.com', password: '123', jumlah_gaji_pokok: 100, bonus: 0, });
        await Karyawan.create({ karyawan_id: 2, nama_karyawan: "Siti", divisi_karyawan_id: 2, cabang_id: 2, cabang_id_first: 2, email: 'ab@gmail.com', password: '123', jumlah_gaji_pokok: 100, bonus: 0, });

        // Seed data for Kpi  
        await Kpi.create({ divisi_karyawan_id: 1, nama_kpi: "Target Penjualan", persentase: 75, waktu: "Bulanan" });
        await Kpi.create({ divisi_karyawan_id: 1, nama_kpi: "Target Beli", persentase: 75, waktu: "Mingguan" });


        console.log("Seed data created!");
    } catch (error) {
        console.error("Error seeding database:", error);
    }
};

module.exports = seedDatabase;  
