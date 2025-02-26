const express = require("express");
const sequelize = require("./models/index");
const errorHandler = require("./utils/errorHandler");
const cors = require('cors');
const {checkBlacklist, authenticateToken} = require('./config/middleware');

const fs = require('fs');
const path = require('path');
const { AuthenticationController } = require("./controllers/authenticationController");

const app = express();
const port = 3000;
require('dotenv').config();

//Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(express.static(path.join(__dirname, 'public')));
app.use('/images-karyawan', express.static(path.join(__dirname, 'public/karyawan')));
app.use('/images-absensi-karyawan', express.static(path.join(__dirname, 'public/absensiKaryawan')));
app.use('/images-packaging', express.static(path.join(__dirname, 'public/packaging')));
app.use('/images-barang-custom', express.static(path.join(__dirname, 'public/barangCustom')));
app.use('/images-barang-handmade', express.static(path.join(__dirname, 'public/barangHandmade')));
app.use('/images-barang-non-handmade', express.static(path.join(__dirname, 'public/barangNonHandmade')));
app.use('/images-barang-handmade-gudang', express.static(path.join(__dirname, 'public/barangHandmadeGudang')));
app.use('/images-barang-non-handmade-gudang', express.static(path.join(__dirname, 'public/barangNonHandmadeGudang')));
app.use('/images-packaging-gudang', express.static(path.join(__dirname, 'public/packagingGudang')));
app.use('/images-barang-handmade', express.static(path.join(__dirname, 'public/barangHandmade')));
app.use('/images-barang-mentah', express.static(path.join(__dirname, 'public/barangMentah')));
app.use('/images-toko', express.static(path.join(__dirname, 'public/toko')));
app.use('/images-authentication', express.static(path.join(__dirname, 'public/authentication')));

const corsOptions = {
  origin: process.env.NODE_ENV === 'development'
    ? [process.env.DEV_ORIGIN]
    : [process.env.PROD_ORIGIN],
};

app.use(cors(corsOptions)); 

const routesCache = {}; // Object to cache routes  

const loadRoutes = (app) => {
  const routesPath = path.join(__dirname, 'routes');

  fs.readdir(routesPath, (err, files) => {
    if (err) {
      console.error('Error reading routes directory:', err);
      return;
    }

    files.forEach(file => {
      if (file.endsWith('Routes.js')) {
        if (!routesCache[file]) {
          const route = require(path.join(routesPath, file));
          app.use('/api', route);
          routesCache[file] = route;
        }
      }
    });
  });
};

// Watch for changes in the routes directory  
const watchRoutes = (app) => {
  const routesPath = path.join(__dirname, 'routes');
  fs.watch(routesPath, (eventType, filename) => {
    if (filename && filename.endsWith('Routes.js')) {
      console.log(`File changed: ${filename}. Reloading routes...`);
      // Clear the cache and reload routes  
      delete require.cache[require.resolve(path.join(routesPath, filename))];
      loadRoutes(app);
    }
  });
};

// Load and watch routes  
loadRoutes(app);
watchRoutes(app);
// Apply the middleware to all routes except the login route
// Define the login route explicitly
app.post('/api/login', AuthenticationController.login);

app.use('/api', checkBlacklist, authenticateToken); 
//Error Handling
app.use(errorHandler);

// Sync the database only if not in production
if (process.env.NODE_ENV !== 'production') {
  sequelize.sequelize.sync().then(() => {
      console.log("Database synced");
      app.listen(port, () => {
          console.log(`Server runs on ${port}`);
      });
  });
} else {
  app.listen(port, () => {
      console.log(`Server runs on ${port}`);
  });
}
