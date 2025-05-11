const express = require("express");
const auth = require("../middleware/auth");
const checkPermission = require("../middleware/checkPermission");
const { PERMISSIONS } = require("../../config/roles");

const Products = require("../controllers/product.controller");
const productsRoute = express.Router();

productsRoute.use(auth);

productsRoute
  .post("/addProduct", checkPermission(PERMISSIONS.MANAGE_PRODUCTS), Products.AddProduct)
  .get("/getProduct", checkPermission(PERMISSIONS.VIEW_PRODUCTS), Products.GetAllProducts)
  .patch("/updateProduct/:id", checkPermission(PERMISSIONS.MANAGE_PRODUCTS), Products.UpdateProduct)
  .delete("/deleteProduct/:id", checkPermission(PERMISSIONS.MANAGE_PRODUCTS), Products.DeleteProduct)
  .get("/getProductStatus", checkPermission(PERMISSIONS.VIEW_PRODUCTS), Products.GetProductStatus)
  .post("/addManyProducts", checkPermission(PERMISSIONS.MANAGE_PRODUCTS), Products.AddManyProducts);
module.exports = productsRoute;
