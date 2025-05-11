const express = require("express");
const auth = require("../middleware/auth");
const checkPermission = require("../middleware/checkPermission");
const { PERMISSIONS } = require("../../config/roles");

const AdminController = require("../controllers/admin.controller");

const adminRoute = express.Router();

adminRoute.use(auth);

adminRoute
  .get("/getAllProducts", checkPermission(PERMISSIONS.VIEW_PRODUCTS), AdminController.GetAllProducts)
  .get("/getAllTransactions", checkPermission(PERMISSIONS.VIEW_ORDERS), AdminController.GetAllTransactions)
  .get("/getAllCategories", checkPermission(PERMISSIONS.VIEW_CATEGORIES), AdminController.GetAllCategories)
  .get("/adminDashboard", checkPermission(PERMISSIONS.VIEW_ANALYTICS), AdminController.AdminDashboard)
  .delete("/deleteUser/:id", checkPermission(PERMISSIONS.DELETE_USER), AdminController.DeleteUser);

module.exports = adminRoute;
