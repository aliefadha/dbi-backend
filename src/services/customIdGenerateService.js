const Packaging = require("../models/packaging");
const BarangCustom = require("../models/barangCustom");
const BarangHandmade = require("../models/barangHandmade");
const BarangHandmadeGudang = require("../models/barangHandmadeGudang");
const BarangNonHandmadeGudang = require("../models/barangNonHandmadeGudang");

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

    static async generateRincianBiayaGudangId() {
        const lastRincianBiaya = await RincianBiayaGudang.findOne({
            order: [['rincian_biaya_id', 'DESC']]
        });

        if (!lastRincianBiaya) {
            return 'RBG0001';
        }
        const lastId = lastRincianBiaya.rincian_biaya_id;
        const numericPart = parseInt(lastId.slice(3), 10);
        const newNumericPart = numericPart + 1;
        const newId = `RBG${String(newNumericPart).padStart(4, '0')}`;
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
}

module.exports = CustomIdGenerateService;