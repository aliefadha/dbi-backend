const express = require("express");
const sequelize = require("./models/index");
const errorHandler = require("./utils/errorHandler");

const fs = require('fs');
const path = require('path');

const app = express();
const port = 3000;

//Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

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
//Error Handling
app.use(errorHandler);

sequelize.sequelize.sync({ force: true }).then(() => {
  console.log("database synced");
  app.listen(port, () => {
    console.log(`Server runs on ${port}`);
  });
});
