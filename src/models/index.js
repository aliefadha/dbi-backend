// relation files

// models/relation.js  
const sequelize = require('../config/database');
const BarangHandmadeNon = require('./barangHandmadeNon');
const KategoriBarang = require('./kategoriBarang');


KategoriBarang.hasMany(BarangHandmadeNon, {
    foreignKey: 'kategori_barang_id',
    as: "barang"
});

BarangHandmadeNon.belongsTo(KategoriBarang, {
    foreignKey: 'kategori_barang_id',
    as: "kategori"
})

// Sync models with the database  
const syncDatabase = async () => {
    try {
        await sequelize.sync({ force: true }); // Use force: true only in development  
        console.log("Database & tables created!");
    } catch (error) {
        console.error("Error syncing database:", error);
    }
};

syncDatabase();

module.exports = {
    sequelize,
    KategoriBarang,
    BarangHandmadeNon,
};  
