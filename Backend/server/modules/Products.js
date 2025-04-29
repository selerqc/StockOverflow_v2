const productsModel = require("../models/products.model");

const validator = require("validator");

const ProductsController = {
  GetProductStatus: async (req, res) => {
    const getProductsThatHaveLowStock = await productsModel.find({
      stock_level: { $lt: 21 },
    });
    const productCount = await productsModel.countDocuments({
      user_id: req.user._id,
    });

    const lowStockCount = await productsModel.countDocuments({
      user_id: req.user._id,
      stock_level: { $lt: 10 },
    });

    res.status(200).json({
      message: "Product status retrieved successfully",
      productCount,
      lowStockCount,
      getProductsThatHaveLowStock,
    });
  },

  GetAllProducts: async (req, res) => {
    const products = await productsModel
      .find({})
      .populate("category_id", "name")
      .select("-__v");

    res.status(200).json({
      message: "Products retrieved successfully",
      product: products,
    });
  },

  AddProduct: async (req, res) => {
    const { name, price, category_id, stock_level, sku } = req.body;

    if (!name || !price || !category_id || !stock_level || !sku)
      throw "All fields are required";
    if (!validator.isNumeric(price.toString())) throw "Price must be a number";
    if (!validator.isNumeric(stock_level.toString()))
      throw "Stock level must be a number";
    if (!validator.isLength(name, { min: 3, max: 50 }))
      throw new Error("Name must be between 3 and 50 characters");

    if (price < 1) throw "Price must be greater than 0";
    if (stock_level < 1) throw "Stock level must be greater than 0";
    if (stock_level > 1000) throw "Stock level must be less than 1000";

    if (sku.length < 3 || sku.length > 10)
      throw new Error("SKU must be between 3 and 10 characters");

    const findDuplicateName = await productsModel.findOne({
      user_id: req.user._id,
      name: name,
    });
    const findDuplicateSku = await productsModel.findOne({
      user_id: req.user._id,
      sku: sku,
    });
    if (findDuplicateName) throw "Product already exists";
    if (findDuplicateSku) throw "SKU already exists";

    const addProduct = await productsModel.create({
      user_id: req.user._id,
      category_id: category_id,
      name: name,
      price: price,
      stock_level: stock_level,
      sku: sku,
    });

    res.status(201).json({
      status: "success",
      message: "Product added successfully",
      product: addProduct.createdAt,
    });
  },
  AddManyProducts: async (req, res) => {
    const products = Array.isArray(req.body) ? req.body : [];
    console.log(products);
    if (!products || products.length === 0) throw "Products are required";

    const productsToAdd = products.map((product) => {
      const { name, price, category_id, stock_level, sku } = product;

      return productsModel.create({
        user_id: req.user._id,
        category_id: category_id,
        name: name,
        price: price,
        stock_level: stock_level,
        sku: sku,
      });
    });
    await Promise.all(productsToAdd);
    res.status(201).json({
      status: "success",
      message: "Products added successfully",
      products: products,
    });
  },

  UpdateProduct: async (req, res) => {
    try {
      const { name, price, category_id, stock_level, sku } = req.body;

      if (validator.isEmpty(name, { ignore_whitespace: true }))
        throw "Name is required";
      if (validator.isEmpty(price, { ignore_whitespace: true }))
        throw "Price is required";
      if (validator.isEmpty(category_id, { ignore_whitespace: true }))
        throw "Category is required";
      if (validator.isEmpty(stock_level, { ignore_whitespace: true }))
        throw "Stock level is required";
      if (validator.isEmpty(sku, { ignore_whitespace: true }))
        throw "SKU is required";
      if (!validator.isNumeric(price.toString()))
        throw "Price must be a number";
      if (!validator.isNumeric(stock_level.toString()))
        throw "Stock level must be a number";

      const updatedProduct = await productsModel.findOneAndUpdate(
        { _id: req.params.id, user_id: req.user._id },

        {
          name: name,
          category_id: category_id,
          price: price,
          stock_level: stock_level,
          sku: sku,
        },
        { new: true }
      );

      res.status(200).json({
        status: "success",
        message: "Product updated successfully",
        product: updatedProduct.updatedAt,
      });
    } catch (error) {
      throw error;
    }
  },

  DeleteProduct: async (req, res) => {
    const { id } = req.params;

    const isproductExists = await productsModel.findOne({
      user_id: req.user._id,
      _id: id,
    });
    if (!isproductExists) throw "Product not found";

    const product = await productsModel.findOneAndDelete({
      user_id: req.user._id,
      _id: id,
    });

    res.status(200).json({
      status: "success",
      message: "Product deleted successfully",
      product,
    });
  },
};
module.exports = ProductsController;
