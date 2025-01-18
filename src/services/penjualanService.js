const Barang = require("../models/barang");
const MetodePembayaran = require("../models/metodePembayaran");
const Penjualan = require("../models/penjualan");
const ProdukPenjualan = require("../models/produkPenjualan");

class PenjualanService {
    static async create(data) {
        return await Penjualan.create(data);
    }

    static async getAll() {
        return Penjualan.findAll()
    }
    static async getById(id) {
        const penjualan = await Penjualan.findByPk(id);

        if (!penjualan) {
            return null;
        }

        const result = {
            penjualan_id: penjualan.penjualan_id,
            tanggal_waktu: penjualan.tanggal_waktu,
            nama_pembeli: penjualan.nama_pembeli,
            cash_or_non: penjualan.cash_or_non,
            sub_total: penjualan.sub_total,
            diskon: penjualan.diskon,
            pajak: penjualan.pajak,
            total_penjualan: penjualan.total_penjualan,
            metode_pembayaran_id: penjualan.metode_pembayaran_id,
            metode: penjualan.metode.nama_metode,
            produk: penjualan.produk.map(item => ({  
                barang_id: item.barang_id,  
                nama_barang: item.barang.nama_barang,  
                kuantitas: item.kuantitas,  
                total_biaya: item.total_biaya  
            })),  
            produk_count: penjualan.produk.length,
        };

        return result;
    }

}

module.exports = PenjualanService