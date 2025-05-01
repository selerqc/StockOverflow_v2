const express = require("express");
const auth = require("../middleware/auth");

const Category = require("../controllers/category.controller");
const categoryRoute = express.Router();

categoryRoute.use(auth);

categoryRoute
  .post("/addCategory", Category.AddCategory)
  .get("/getCategory", Category.GetAllCategory)
  .delete("/deleteCategory/:id", Category.DeleteOneCategory)
  .patch("/updateCategory/:id", Category.UpdateCategory)
  .post("/addManyCategory", Category.AddManyCategory);

module.exports = categoryRoute;
