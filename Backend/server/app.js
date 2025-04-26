require("express-async-errors");
require("dotenv").config();

const express = require("express");
const errorHandler = require("./handler/errorHandler");
const cors = require("cors");
const connection = require("./config/connection");

const userRoute = require("./routes/user.route");
const productsRoute = require("./routes/products.route");
const transactionRoute = require("./routes/transaction.route");
const alertsRoute = require("./routes/alerts.route");
const categoryRoute = require("./routes/category.route");
const adminRoute = require("./routes/Admin/admin.route");

const app = express();

app.use(cors());
app.use(express.json());

connection();
//models
require("./models/user.model");
require("./models/products.model");
require("./models/transaction.model");
require("./models/category.model");
require("./models/alert.model");

// Import routes
app.use("/api/users", userRoute);
app.use("/api/products", productsRoute);
app.use("/api/transactions", transactionRoute);
app.use("/api/alerts", alertsRoute);
app.use("/api/category", categoryRoute);
app.use("/api/admin", adminRoute);

app.use(errorHandler);

const port = 8000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
