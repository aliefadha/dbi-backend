const BarangCustom = require("../models/barangCustom");
const BarangHandmade = require("../models/barangHandmade");
const BarangNonHandmade = require("../models/barangNonHandmade");
const Cabang = require("../models/cabang");
const JenisBarang = require("../models/jenisBarang");
const KategoriBarang = require("../models/kategoriBarang");
const Packaging = require("../models/packaging");
const StokBarang = require("../models/stokBarang");  
const XLSX = require("xlsx");
  
class StokBarangService {  
  static async create(data) {  
    return await StokBarang.create(data);  
  }  
  
  static async getAll(cabang, toko_id) {  
    const whereConditions = {
      is_deleted: false,
    };

    if (cabang) {
      whereConditions.cabang_id = cabang;
    }
    
    if (toko_id) {
      whereConditions.toko_id = toko_id;
    }

    const data = await StokBarang.findAll({
      where: whereConditions,
      include: [
        { model: Cabang, as: "cabang", attributes: ["nama_cabang"] },
        { model: BarangHandmade, as: "barang_handmade", attributes: ["nama_barang"],
          include: [
            {
              model: KategoriBarang,
              as: "kategori_barang",
              attributes: ["nama_kategori_barang"]
            },
            {
              model: JenisBarang,
              as: "jenis_barang",
              attributes: ["nama_jenis_barang"]
            }
          ]
         },
        { model: BarangNonHandmade, as: "barang_non_handmade", attributes: ["nama_barang"],
          include: [
            {
              model: KategoriBarang,
              as: "kategori",
              attributes: ["nama_kategori_barang"]
            },
            {
              model: JenisBarang,
              as: "jenis",
              attributes: ["nama_jenis_barang"]
            }
          ]
         },
        { model: BarangCustom, as: "barang_custom", attributes: ["nama_barang"],
          include: [
            {
              model: KategoriBarang,
              as: "kategori",
              attributes: ["nama_kategori_barang"]
            },
            {
              model: JenisBarang,
              as: "jenis_barang",
              attributes: ["nama_jenis_barang"]
            }
          ]
         },
        { model: Packaging, as: "packaging", attributes: ["nama_packaging"],
          include: [
            {
              model: JenisBarang,
              as: "jenis_barang",
              attributes: ["jenis_barang_id", "nama_jenis_barang"]
            },
            {
              model: KategoriBarang,
              as: "kategori_barang",
              attributes: ["kategori_barang_id", "nama_kategori_barang"]
            }
          ]
         },
      ]
    });  

    return data;
  }  
  
  static async getById(id) {  
    return await StokBarang.findOne({
      where: {
        stok_barang_id: id,
        is_deleted: false
      }
    });  
  }  
  
  static async update(id, data) {  
    const stokBarang = await StokBarang.findByPk(id);  
    if (!stokBarang) return null;  
  
    Object.assign(stokBarang, data);  
    await stokBarang.save();  
  
    return stokBarang;  
  }  
  
  static async delete(id) {  
    const stokBarang = await StokBarang.findByPk(id);  
    if (!stokBarang) return null;  
    await stokBarang.update({ is_deleted: true });  
    return true;  
  }  

  static async exportToExcel(toko_id, cabang) {
    const result = await this.getAll(cabang, toko_id);

    // Group data by packaging_id, barang_handmade_id, barang_non_handmade_id, barang_custom_id
    const groupedData = result.reduce((acc, current) => {
        const key = [
            current.packaging_id,
            current.barang_handmade_id,
            current.barang_non_handmade_id,
            current.barang_custom_id
        ].filter(id => id !== null).join('-'); // Create a unique key for each group

        const existingEntry = acc.find(item => item.key === key);
        if (existingEntry) {
            existingEntry.jumlah_stok += current.jumlah_stok;
        } else {
            acc.push({
                key,
                id: current.packaging_id || current.barang_handmade_id || current.barang_non_handmade_id || current.barang_custom_id,
                nama_barang: current.packaging ? current.packaging.nama_packaging : 
                            current.barang_handmade ? current.barang_handmade.nama_barang : 
                            current.barang_non_handmade ? current.barang_non_handmade.nama_barang : 
                            current.barang_custom ? current.barang_custom.nama_barang : '',
                jenis: current.packaging ? "Packaging" : 
                     current.barang_handmade ? "Handmade" : 
                     current.barang_non_handmade ? "Non Handmade" : 
                     current.barang_custom ? "Custom" : '',
                kategori: current.packaging ? current.packaging.kategori_barang.nama_kategori_barang : 
                       current.barang_handmade ? current.barang_handmade.kategori_barang.nama_kategori_barang : 
                       current.barang_non_handmade ? current.barang_non_handmade.kategori_barang.nama_kategori_barang : 
                       current.barang_custom ? current.barang_custom.kategori.nama_kategori_barang : '',
                jumlah_stok: current.jumlah_stok,
                cabang: current.cabang ? current.cabang.nama_cabang : ''
            });
        }
        return acc;
    }, []);

    // Prepare data for Excel
    const excelData = groupedData.map(item => ({
        ID: item.id,
        NamaBarang: item.nama_barang,
        Jenis: item.jenis,
        Kategori: item.kategori,
        JumlahStok: item.jumlah_stok,
        Cabang: item.cabang
    }));

    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.json_to_sheet(excelData);
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Stok Barang');

    return workbook;
}
}  
  
module.exports = StokBarangService;  
