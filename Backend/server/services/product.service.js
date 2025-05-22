const productsModel = require("../models/products.model");
const validator = require("validator");

const ProductService = {

  async getProductStatus(userId) {
    const getProductsThatHaveLowStock = await productsModel.find({
      stock_level: { $lt: 21 },
    });
    const productCount = await productsModel.countDocuments({
      user_id: userId,
    });

    const lowStockCount = await productsModel.countDocuments({
      user_id: userId,
      stock_level: { $lt: 10 },
    });

    return {
      productCount,
      lowStockCount,
      getProductsThatHaveLowStock,
    };
  },

  async getAllProducts() {
    return await productsModel
      .find({})
      .populate("category_id", "name")
      .populate("user_id", "username")
      .select("-__v");
  },


  async addProduct(productData, userId) {
    const { name, price, category_id, stock_level, sku } = productData;

    if (!name || !price || !category_id || !stock_level || !sku)
      throw "All fields are required";

    const findDuplicateName = await productsModel.findOne({
      name: name,
    });
    const findDuplicateSku = await productsModel.findOne({
      sku: sku,
    });
    if (!validator.isAlphanumeric(name)) throw "Name must be alphanumeric";
    if (findDuplicateName) throw "Product already exists with this name";

    if (findDuplicateSku) throw "SKU already exists";
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

    const addProduct = await productsModel.create({
      user_id: userId,
      category_id: category_id,
      name: name,
      price: price,
      stock_level: stock_level,
      sku: sku,
    });

    return addProduct;
  },


  async addManyProducts(products, userId) {
    if (!products || products.length === 0) throw "Products are required";

    const productsToAdd = products.map((product) => {
      const { name, price, category_id, stock_level, sku } = product;

      return productsModel.create({
        user_id: userId,
        category_id: category_id,
        name: name,
        price: price,
        stock_level: stock_level,
        sku: sku,
      });
    });

    return await Promise.all(productsToAdd);
  },


  async updateProduct(productId, productData, userId) {
    const { name, price, category_id, stock_level, sku } = productData;

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
      { _id: productId, user_id: userId },
      {
        name: name,
        category_id: category_id,
        price: price,
        stock_level: stock_level,
        sku: sku,
      },
      { new: true }
    );

    return updatedProduct;
  },


  async deleteProduct(productId, userId) {
    const isProductExists = await productsModel.findOne({
      user_id: userId,
      _id: productId,
    });

    if (!isProductExists) throw "Product not found";

    return await productsModel.findOneAndDelete({
      user_id: userId,
      _id: productId,
    });
  }
};

module.exports = ProductService;