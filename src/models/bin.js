JenisBarang.hasMany(BarangNonHandmade, {
    foreignKey: 'jenis_barang_id',
    as: "barangNonHandmade",
});

JenisBarang.hasMany(BarangCustom, {
    foreignKey: 'jenis_barang_id',
    as: "barangCustom"
})

KategoriBarang.hasMany(BarangNonHandmade, {
    foreignKey: 'kategori_barang_id',
    as: "barangNonHandmade",
});

Packaging.hasMany(BarangNonHandmade, {
    foreignKey: 'packaging_id',
    as: "barang",
})

BarangNonHandmade.belongsTo(KategoriBarang, {
    foreignKey: 'kategori_barang_id',
    as: "kategori",
})

BarangNonHandmade.belongsTo(JenisBarang, {
    foreignKey: "jenis_barang_id",
    as: "jenis",
})

BarangNonHandmade.belongsTo(Packaging, {
    foreignKey: "packaging_id",
    as: "packaging",
})

BarangCustom.belongsTo(KategoriBarang, {
    foreignKey: 'kategori_barang_id',
    as: "kategori",
})

