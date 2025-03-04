const BarangHandmadeGudang = require("../models/barangHandmadeGudang");
const BarangMentah = require("../models/barangMentah");
const BarangNonHandmadeGudang = require("../models/barangNonHandmadeGudang");
const JenisBarangGudang = require("../models/jenisBarangGudang");
const KategoriBarangGudang = require("../models/kategoriBarangGudang");
const Packaging = require("../models/packaging");
const PackagingGudang = require("../models/packagingGudang");
const StokBarangGudang = require("../models/stokBarangGudang");  
const XLSX = require("xlsx");

class StokBarangGudangService {  
  static async create(data) {  
    return await StokBarangGudang.create(data);  
  }  
  
  static async getAll(kategori_barang_id, jenis_barang_id) {  
    const whereConditionsHandmade = {
      is_deleted: false,
    }
    const whereConditionsNonHandmade = {
      is_deleted: false,
    }
    if (kategori_barang_id) {
      whereConditionsHandmade.kategori_barang_id = kategori_barang_id
      whereConditionsNonHandmade.kategori_barang_id = kategori_barang_id
    }
    if (jenis_barang_id) {
      whereConditionsHandmade.jenis_barang_id = jenis_barang_id
      whereConditionsNonHandmade.jenis_barang_id = jenis_barang_id
    }
    const stokBarangGudangList = await StokBarangGudang.findAll({
      where: {
        is_deleted: false
      },
      attributes: {
        exclude: ["stok_barang_gudang_id", "barang_nonhandmade_id", "barang_mentah_id", "packaging_id", "barang_handmade_id"]
      },
      include: [
        {
          model: BarangNonHandmadeGudang,
          as: "barang_nonhandmade",
          attributes: ["image", "barang_nonhandmade_id", "nama_barang", "harga_jual", "is_deleted"],
          required: false,
          where: whereConditionsNonHandmade,
          include: [
            {
              model: KategoriBarangGudang,
              as: "kategori",
              attributes: ["nama_kategori_barang", "is_deleted"],
              required: false,
            },
            {
              model: JenisBarangGudang,
              as: "jenis",
              attributes: ["nama_jenis_barang", "is_deleted"],
              required: false,
            }
          ]
        },
        {
          model: BarangHandmadeGudang,
          as: "barang_handmade",
          attributes: ["image", "barang_handmade_id", "nama_barang", "harga_jual", "is_deleted"],
          required: false,
          where: whereConditionsHandmade,
          include: [
            {
              model: KategoriBarangGudang,
              as: "kategori",
              attributes: ["nama_kategori_barang", "is_deleted"],
              required: false,
            },
            {
              model: JenisBarangGudang,
              as: "jenis",
              attributes: ["nama_jenis_barang", "is_deleted"],
              required: false,
            }
          ]
        },
        {
          model: BarangMentah,
          as: "barang_mentah",
          attributes: ["image", "barang_mentah_id", "nama_barang", "harga_satuan", "is_deleted"],
          required: false,
        },
        {
          model: PackagingGudang,
          as: "packaging",
          attributes: ["image", "packaging_id", "nama_packaging", "ukuran", "harga_satuan"],
          required: false,
        },
      ]
    });  
    const response = stokBarangGudangList.map(item => {  
    const { barang_nonhandmade, barang_mentah, packaging, barang_handmade,...rest } = item.toJSON();
    
      let barang = null;  
      if (barang_nonhandmade) {  
        barang = barang_nonhandmade;  
      } else if (barang_mentah) {  
        barang = barang_mentah;  
      } else if (packaging) {  
        barang = packaging;  
      } else if (barang_handmade) {
        barang = barang_handmade;
      }
      return {  
        ...rest,  
        barang,  
      };  
    });  
    const filteredResponse = response.filter(item => item.barang !== null);

    return filteredResponse;
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

  static async exportToExcel(kategori_barang_id, jenis_barang_id) {
    const result = await this.getAll(kategori_barang_id, jenis_barang_id);
    // console.log(result);
    const data = result.map((item) => ({
      ID: item.barang.barang_handmade_id || item.barang.barang_nonhandmade_id || item.barang.barang_mentah_id || item.barang.packaging_id,
      NamaBarang: item.barang.nama_barang || item.barang.nama_packaging,
      Jenis: item.barang.jenis ? item.barang.jenis.nama_jenis_barang : '',
      Kategori: item.barang.kategori ? item.barang.kategori.nama_kategori_barang : '',
      Stok: item.jumlah_stok
    }))
    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.json_to_sheet(data);
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Stok Barang');
    return workbook;
  }
}  
  
module.exports = StokBarangGudangService;  
