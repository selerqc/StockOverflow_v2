const express = require("express");
const auth = require("../../middleware/auth");

const AdminController = require("../../modules/Admin/admin.controller");

const adminRoute = express.Router();

adminRoute.use(auth);

adminRoute
  .get("/getAllProducts", AdminController.GetAllProducts)
  .get("/getAllTransactions", AdminController.GetAllTransactions)
  .get("/getAllCategories", AdminController.GetAllCategories)
  .get("/adminDashboard", AdminController.AdminDashboard);
module.exports = adminRoute;
