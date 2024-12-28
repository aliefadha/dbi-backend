const express = require("express");
const sequelize = require("./config/database");
const errorHandler = require("./utils/errorHandler");

const tokoRoutes = require("./routes/tokoRoutes");

const app = express();
const port = 3000;

//Middleware
app.use(express.json());

//Routes
app.use("/api", tokoRoutes);

//Error Handling
app.use(errorHandler);

sequelize.sync({ force: false }).then(() => {
  console.log("database synced");
  app.listen(port, () => {
    console.log(`Server runs on ${port}`);
  });
});
