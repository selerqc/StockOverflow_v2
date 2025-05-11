const express = require("express");
const auth = require("../middleware/auth");
const checkPermission = require("../middleware/checkPermission");
const { PERMISSIONS } = require("../../config/roles");

const Category = require("../controllers/category.controller");
const categoryRoute = express.Router();

categoryRoute.use(auth);

categoryRoute
  .post("/addCategory", checkPermission(PERMISSIONS.MANAGE_CATEGORIES), Category.AddCategory)
  .get("/getCategory", checkPermission(PERMISSIONS.VIEW_CATEGORIES), Category.GetAllCategory)
  .delete("/deleteCategory/:id", checkPermission(PERMISSIONS.MANAGE_CATEGORIES), Category.DeleteOneCategory)
  .patch("/updateCategory/:id", checkPermission(PERMISSIONS.MANAGE_CATEGORIES), Category.UpdateCategory)
  .post("/addManyCategory", checkPermission(PERMISSIONS.MANAGE_CATEGORIES), Category.AddManyCategory);

module.exports = categoryRoute;
