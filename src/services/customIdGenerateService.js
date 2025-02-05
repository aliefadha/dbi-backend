const Packaging = require("../models/packaging");
const BarangCustom = require("../models/barangCustom");
const BarangHandmade = require("../models/barangHandmade");
const BarangNonHandmade = require("../models/barangNonHandmade");
const BarangHandmadeGudang = require("../models/barangHandmadeGudang");
const BarangNonHandmadeGudang = require("../models/barangNonHandmadeGudang");
const PackagingGudang = require("../models/packagingGudang");
const BarangMentah = require("../models/barangMentah");
const PembelianGudang = require("../models/pembelianGudang");
const PenjualanGudang = require("../models/penjualanGudang");
const Pembelian = require("../models/pembelian");
const Penjualan = require("../models/penjualan");

class CustomIdGenerateService {
    static async generatePackagingId() {
        const lastPackaging = await Packaging.findOne({  
            order: [['packaging_id', 'DESC']]  
        });  
    
        if (!lastPackaging) {  
            return 'PCK0001';  
        }  
    
        const lastId = lastPackaging.packaging_id;  
        const numericPart = parseInt(lastId.slice(3), 10);  
        const newNumericPart = numericPart + 1;  
        const newId = `PCK${String(newNumericPart).padStart(4, '0')}`;  
    
        return newId;  
    }

    static async generatePackagingGudangId() {
        const lastPackaging = await PackagingGudang.findOne({  
            order: [['packaging_id', 'DESC']]  
        });  
    
        if (!lastPackaging) {  
            return 'PCK0001';  
        }  
    
        const lastId = lastPackaging.packaging_id;  
        const numericPart = parseInt(lastId.slice(3), 10);  
        const newNumericPart = numericPart + 1;  
        const newId = `PCK${String(newNumericPart).padStart(4, '0')}`;  
    
        return newId;  
    }

    static async generateBarangCustomId() {
        const lastBarangCustom = await BarangCustom.findOne({  
            order: [['barang_custom_id', 'DESC']]  
        });  
    
        if (!lastBarangCustom) {  
            return 'CSM0001';  
        }  
    
        const lastId = lastBarangCustom.barang_custom_id;  
        const numericPart = parseInt(lastId.slice(3), 10);  
        const newNumericPart = numericPart + 1;  
        const newId = `CSM${String(newNumericPart).padStart(4, '0')}`;  
    
        return newId;  
    }

    static async generateBarangMentahId() {
        const lastBarangMentah = await BarangMentah.findOne({  
            order: [['barang_mentah_id', 'DESC']]  
        });  
    
        if (!lastBarangMentah) {  
            return 'MTH0001';  
        }  
    
        const lastId = lastBarangMentah.barang_mentah_id;  
        const numericPart = parseInt(lastId.slice(3), 10);  
        const newNumericPart = numericPart + 1;  
        const newId = `MTH${String(newNumericPart).padStart(4, '0')}`;  
    
        return newId;  
    }

    static async generateBarangHandmadeId() {
        const lastBarangHandmade = await BarangHandmade.findOne({  
            order: [['barang_handmade_id', 'DESC']]  
        });  
    
        if (!lastBarangHandmade) {  
            return 'BHM0001';  
        }  
    
        const lastId = lastBarangHandmade.barang_handmade_id;  
        const numericPart = parseInt(lastId.slice(3), 10);  
        const newNumericPart = numericPart + 1;  
        const newId = `BHM${String(newNumericPart).padStart(4, '0')}`;  
    
        return newId;  
    }

    static async generateBarangHandmadeGudangId() {
        const lastBarangHandmade = await BarangHandmadeGudang.findOne({  
            order: [['barang_handmade_id', 'DESC']]  
        });  
    
        if (!lastBarangHandmade) {  
            return 'BHM0001';  
        }  
    
        const lastId = lastBarangHandmade.barang_handmade_id;  
        const numericPart = parseInt(lastId.slice(3), 10);  
        const newNumericPart = numericPart + 1;  
        const newId = `BHM${String(newNumericPart).padStart(4, '0')}`;  
    
        return newId;  
    }

    static async generateBarangNonHandmadeId() {
        const lastBarangNonHandmade = await BarangNonHandmade.findOne({  
            order: [['barang_non_handmade_id', 'DESC']]  
        });  
    
        if (!lastBarangNonHandmade) {  
            return 'BNH0001';  
        }  
    
        const lastId = lastBarangNonHandmade.barang_non_handmade_id;  
        const numericPart = parseInt(lastId.slice(3), 10);  
        const newNumericPart = numericPart + 1;  
        const newId = `BNH${String(newNumericPart).padStart(4, '0')}`;  
    
        return newId;
    }

    static async generateBarangNonHandmadeGudangId() {
        const lastBarangNonHandmade = await BarangNonHandmadeGudang.findOne({  
            order: [['barang_nonhandmade_id', 'DESC']]  
        });  
    
        if (!lastBarangNonHandmade) {  
            return 'BNH0001';  
        }  
    
        const lastId = lastBarangNonHandmade.barang_nonhandmade_id;  
        const numericPart = parseInt(lastId.slice(3), 10);  
        const newNumericPart = numericPart + 1;  
        const newId = `BNH${String(newNumericPart).padStart(4, '0')}`;  
    
        return newId;  
    }

    static async generatePembelianGudangId() {
        const lastPembelian = await PembelianGudang.findOne({
            order: [['pembelian_id', 'DESC']]
        });

        if (!lastPembelian) {
            return 'PMB0001';
        }
        const lastId = lastPembelian.pembelian_id;
        const numericPart = parseInt(lastId.slice(3), 10);
        const newNumericPart = numericPart + 1;
        const newId = `PMB${String(newNumericPart).padStart(4, '0')}`;
        return newId;
    }

    static async generatePenjualanGudangId() {
        const lastPenjualan = await PenjualanGudang.findOne({
            order: [['penjualan_id', 'DESC']]
        });

        if (!lastPenjualan) {
            return 'PNJ0001';
        }
        const lastId = lastPenjualan.penjualan_id;
        const numericPart = parseInt(lastId.slice(3), 10);
        const newNumericPart = numericPart + 1;
        const newId = `PNJ${String(newNumericPart).padStart(4, '0')}`;
        return newId;
    }

    static async generatePembelianId() {
        const lastPembelian = await Pembelian.findOne({
            order: [['pembelian_id', 'DESC']]
        });

        if (!lastPembelian) {
            return 'PMB0001';
        }
        const lastId = lastPembelian.pembelian_id;
        const numericPart = parseInt(lastId.slice(3), 10);
        const newNumericPart = numericPart + 1;
        const newId = `PMB${String(newNumericPart).padStart(4, '0')}`;
        return newId;
    }

    static async generatePenjualanId() {
        const lastPenjualan = await Penjualan.findOne({
            order: [['penjualan_id', 'DESC']]
        });

        if (!lastPenjualan) {
            return 'PNJ0001';
        }
        const lastId = lastPenjualan.penjualan_id;
        const numericPart = parseInt(lastId.slice(3), 10);
        const newNumericPart = numericPart + 1;
        const newId = `PNJ${String(newNumericPart).padStart(4, '0')}`;
        return newId;
    }


}

module.exports = CustomIdGenerateService;