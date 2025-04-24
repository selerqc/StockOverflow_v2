const express = require("express");
const auth = require("../middleware/auth");

const Products = require("../modules/products/Products");
const productsRoute = express.Router();

productsRoute.use(auth);

productsRoute
  .post("/addProduct", Products.AddProduct)
  .get("/getProduct", Products.GetAllProducts)
  .patch("/updateProduct/:id", Products.UpdateProduct)
  .delete("/deleteProduct/:id", Products.DeleteProduct)
  .get("/getProductStatus", Products.GetProductStatus);
module.exports = productsRoute;
