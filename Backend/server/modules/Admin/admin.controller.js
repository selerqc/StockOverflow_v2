const productsModel = require("../../models/products.model");
const transactionsModel = require("../../models/transaction.model");
const categoryModel = require("../../models/category.model");
const { GetAllTransactions, TransactionStatus } = require("../Transactions");

const AdminController = {
  GetAllProducts: async (req, res) => {
    const products = await productsModel
      .find({})
      .populate("category_id", "name")
      .select("-__v");
    const lowStockCount = await productsModel.countDocuments({
      stock_level: { $lte: 10 },
    });

    res.status(200).json({
      status: "success",
      message: "Products retrieved successfully",
      data: products,
      productCount: products.length,
      lowStockCount: lowStockCount,
    });
  },
  GetAllTransactions: async (req, res) => {
    let pending = 0;
    const transactions = await transactionsModel.find({}).select({
      __v: 0,
    });

    const products = await productsModel.find({}).select({
      __v: 0,
      createdAt: 0,
      updatedAt: 0,
      stock_level: 0,
      price: 0,
      category: 0,
      sku: 0,
    });

    const transformedTransactions = transactions.map((transaction) => ({
      ...transaction.toObject(),
      product_id: transaction.product_id.toString(),
      createdAt: new Date(transaction.createdAt).toLocaleString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      }),
    }));
    transactions.forEach((transaction) => {
      if (transaction.status === "pending") pending++;
    });
    res.status(200).json({
      message: "Transactions retrieved successfully",
      data: transformedTransactions,
      products: products,
      pending: pending,
    });
  },

  GetAllCategories: async (req, res) => {
    const categories = await categoryModel.find({}).select({ _v: 0 });
    res.status(200).json({
      status: "success",
      message: "Categories retrieved successfully",
      data: categories,
    });
  },
};

module.exports = AdminController;
