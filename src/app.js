const express = require("express");
const sequelize = require("./config/database");
const errorHandler = require("./utils/errorHandler");

const tokoRoutes = require("./routes/tokoRoutes");
const kategoriBarangRoutes = require("./routes/kategoriBarangRoutes");
const metodePembayaranRoutes = require("./routes/metodePembayaranRoutes");
const penjualanRoutes = require("./routes/penjualanRoutes");
const barangHandmadeNonRoutes = require("./routes/barangHandmadeNonRoutes");
const packagingRoutes = require("./routes/packagingRoutes");
const rincianBiayaRoutes = require("./routes/rincianBiayaRoutes");


const app = express();
const port = 3000;

//Middleware
app.use(express.json());

//Routes
app.use("/api", [tokoRoutes, kategoriBarangRoutes, metodePembayaranRoutes, penjualanRoutes, barangHandmadeNonRoutes, packagingRoutes, rincianBiayaRoutes]);

//Error Handling
app.use(errorHandler);

sequelize.sync({ force: false }).then(() => {
  console.log("database synced");
  app.listen(port, () => {
    console.log(`Server runs on ${port}`);
  });
});
