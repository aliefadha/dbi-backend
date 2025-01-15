const express = require("express");
const sequelize = require("./models/index");
const errorHandler = require("./utils/errorHandler");

const tokoRoutes = require("./routes/tokoRoutes");
const kategoriBarangRoutes = require("./routes/kategoriBarangRoutes");
const metodePembayaranRoutes = require("./routes/metodePembayaranRoutes");
const penjualanRoutes = require("./routes/penjualanRoutes");
const barangHandmadeNonRoutes = require("./routes/barangHandmadeNonRoutes");
const packagingRoutes = require("./routes/packagingRoutes");
const rincianBiayaRoutes = require("./routes/rincianBiayaRoutes");

const divisiKaryawanRoutes = require("./routes/divisiKaryawanRoutes");
const karyawanRoutes = require("./routes/karyawanRoutes");
const jenisBarangRoutes = require("./routes/jenisBarangRoutes");

const app = express();
const port = 3000;

//Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

//Routes
app.use("/api", [
  tokoRoutes,
  kategoriBarangRoutes,
  metodePembayaranRoutes,
  penjualanRoutes,
  barangHandmadeNonRoutes,
  packagingRoutes,
  rincianBiayaRoutes,
  divisiKaryawanRoutes,
  karyawanRoutes,
  jenisBarangRoutes
]);

//Error Handling
app.use(errorHandler);

sequelize.sequelize.sync({ force: true }).then(() => {
  console.log("database synced");
  app.listen(port, () => {
    console.log(`Server runs on ${port}`);
  });
});
