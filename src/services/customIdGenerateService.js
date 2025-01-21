const Packaging = require("../models/packaging");
const BarangCustom = require("../models/barangCustom");

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
}

module.exports = CustomIdGenerateService;