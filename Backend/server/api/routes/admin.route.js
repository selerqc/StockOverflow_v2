const express = require("express");
const auth = require("../middleware/auth");

const AdminController = require("../controllers/admin.controller");

const adminRoute = express.Router();

adminRoute.use(auth);

adminRoute
  .get("/getAllProducts", AdminController.GetAllProducts)
  .get("/getAllTransactions", AdminController.GetAllTransactions)
  .get("/getAllCategories", AdminController.GetAllCategories)
  .get("/adminDashboard", AdminController.AdminDashboard)
  .delete("/deleteUser/:id", AdminController.DeleteUser);

module.exports = adminRoute;
