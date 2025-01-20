const BarangMentah = require("../models/barangMentah");
const BarangNonHandmadeGudang = require("../models/barangNonHandmadeGudang");
const Packaging = require("../models/packaging");
const PackagingGudang = require("../models/packagingGudang");
const StokBarangGudang = require("../models/stokBarangGudang");  
  
class StokBarangGudangService {  
  static async create(data) {  
    return await StokBarangGudang.create(data);  
  }  
  
  static async getAll() {  
    const stokBarangGudangList = await StokBarangGudang.findAll({
      where: {
        is_deleted: false
      },
      include: [
        {
          model: BarangNonHandmadeGudang,
          as: "barang_nonhandmade"
        },
        {
          model: BarangMentah,
          as: "barang_mentah"
        },
        {
          model: PackagingGudang,
          as: "packaging"
        }
      ]
    });  
    const response = stokBarangGudangList.map(item => {  
    const { barang_nonhandmade, barang_mentah, packaging, ...rest } = item.toJSON();
    
      let barang = null;  
      if (barang_nonhandmade) {  
        barang = barang_nonhandmade;  
      } else if (barang_mentah) {  
        barang = barang_mentah;  
      } else if (packaging) {  
        barang = packaging;  
      }  
      return {  
        ...rest,  
        barang,  
      };  
    });  
    return response;  
  }  
  
  static async getById(id) {  
    const stokBarangGudang = await StokBarangGudang.findOne({  
      where: {  
        stok_barang_gudang_id: id,  
        is_deleted: false  
      },  
      include: [  
        {  
          model: BarangNonHandmadeGudang,  
          as: "barang_nonhandmade"  
        },  
        {  
          model: BarangMentah,  
          as: "barang_mentah"  
        },  
        {  
          model: PackagingGudang,  
          as: "packaging"  
        }  
      ]  
    });  
    
    if (!stokBarangGudang) {  
      return null;
    }  
    
    const { barang_nonhandmade, barang_mentah, packaging, ...rest } = stokBarangGudang.toJSON();  
    
    let barang = null;  
    if (barang_nonhandmade) {  
      barang = barang_nonhandmade;  
    } else if (barang_mentah) {  
      barang = barang_mentah;  
    } else if (packaging) {  
      barang = packaging;  
    }  
     
    return {  
      ...rest,  
      barang,  
    };  
  }  
  
  
  static async update(id, data) {  
    const stokBarangGudang = await StokBarangGudang.findByPk(id);  
    if (!stokBarangGudang) return null;  
  
    Object.assign(stokBarangGudang, data);  
    await stokBarangGudang.save();  
  
    return stokBarangGudang;  
  }  
  
  static async delete(id) {  
    const stokBarangGudang = await StokBarangGudang.findByPk(id);  
    if (!stokBarangGudang) return null;  
    await stokBarangGudang.update({ is_deleted: true });  
    return true;  
  }  
}  
  
module.exports = StokBarangGudangService;  
