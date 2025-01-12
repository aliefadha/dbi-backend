const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const MetodePembayaran = require("./metodePembayaran");

const ProdukPenjualan = sequelize.define("produk_penjualan", {
    produk_penjualan_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
        unique: true,
    },
    tanggal_waktu: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
    },
    nama_pembeli: {
        type: DataTypes.STRING,
    },
    cash_or_non: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
    },
    metode_pembayaran_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: MetodePembayaran,
            key: 'metode_id'
        }
    },
    sub_total: {
        type: DataTypes.INTEGER,
    },
    diskon: {
        type: DataTypes.INTEGER
    },
    pajak: {
        type: DataTypes.INTEGER
    },
    total_penjualan: {
        type: DataTypes.INTEGER
    }
});

ProdukPenjualan.belongsTo(MetodePembayaran, {
    foreignKey: 'metode_pembayaran_id'
})



module.exports = ProdukPenjualan;