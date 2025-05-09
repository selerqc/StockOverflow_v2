const productsModel = require("../models/products.model");
const transactionsModel = require("../models/transaction.model");
const categoryModel = require("../models/category.model");
const alertsModel = require("../models/alert.model");
const UserModel = require("../models/user.model");
const AdminService = {
  async getAllProducts() {
    const products = await productsModel
      .find({})
      .populate("category_id", "name")
      .populate("user_id", "username")
      .select("-__v");

    const lowStockCount = await productsModel.countDocuments({
      stock_level: { $lte: 20 },
    });

    return {
      products,
      productCount: products.length,
      lowStockCount,
    };
  },

  async getAllTransactions() {
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
    })

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

    return {
      transactions: transformedTransactions,
      products,
      pending,
    };
  },

  async getAllCategories() {
    return await categoryModel.find({}).select({ _v: 0 });
  },

  async getAdminDashboard() {
    const products = await productsModel.findOne({}).select("-__v");
    const transactions = await transactionsModel.findOne({}).select("-__v");
    const alerts = await alertsModel.findOne({}).select("-__v");
    const users = await UserModel.findOne({
      isDeleted: false,
    }).select({
      _v: 0,
      password: 0,
    });

    return {
      recentActivities: [
        {
          type: "products",
          products,
        },
        {
          type: "transactions",
          transactions,
        },
        {
          type: "users",
          users,
        },
        {
          type: "alerts",
          alerts,
        },
      ],
    };
  },

  async deleteUser(userId) {
    const user = await UserModel.findOne({
      _id: userId,
    });
    if (!user) throw "User not found";
    const deletedUser = await UserModel.findOneAndUpdate({
      _id: userId,
    }, { isDeleted: true }, { new: true });

    return deletedUser;
  },


};

module.exports = AdminService;