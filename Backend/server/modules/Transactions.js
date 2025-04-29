const userModel = require("../models/user.model");
const productsModel = require("../models/products.model");
const transactionsModel = require("../models/transaction.model");

const transactionsController = {
  GetAllTransactions: async (req, res) => {
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

    res.status(200).json({
      message: "Transactions retrieved successfully",
      data: transformedTransactions,
      products: products,
    });
  },

  TransactionStatus: async (req, res) => {
    let pending = 0,
      completed = 0,
      cancelled = 0;
    const transactions = await transactionsModel.find({
      user_id: req.user._id,
    });

    transactions.forEach((transaction) => {
      if (transaction.status === "pending") pending++;
      if (transaction.status === "completed") completed++;
      if (transaction.status === "cancelled") cancelled++;
    });
    res.status(200).json({
      message: "Pending orders retrieved successfully",
      pending,
      completed,
      cancelled,
    });
  },

  CreateIncomingOrder: async (req, res) => {
    const { product_id, name, customer, stock_level, total_price } = req.body;

    await transactionsModel.create({
      product_id: product_id,
      user_id: req.user._id,
      name: name,
      customer: customer,
      type: "incoming",
      stock_level: stock_level,
      total_price: total_price,
    });
    await productsModel.updateOne(
      { _id: product_id, user_id: req.user._id },
      { $inc: { stock_level: stock_level } }
    );
    res.status(201).json({
      message: "incoming order created successfully",
      status: "success",
    });
  },

  CreateOutgoingOrder: async (req, res) => {
    const { product_id, customer, name, stock_level, total_price } = req.body;

    const product = await productsModel.findOne(
      {
        _id: product_id,
        user_id: req.user._id,
      },
      {
        stock_level: 1,
      }
    );

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
        status: "error",
      });
    }

    if (product.stock_level < stock_level) throw "Insufficient stock ";

    await transactionsModel.create({
      product_id: product_id,
      user_id: req.user._id,
      name: name,
      customer: customer,
      type: "outgoing",
      stock_level: stock_level,
      total_price: total_price,
    });

    await productsModel.updateOne(
      { _id: product_id, user_id: req.user._id },
      { $inc: { stock_level: -stock_level } }
    );

    res.status(201).json({
      message: "outgoing order created successfully",
      status: "success",
    });
  },
  UpdateOneTransaction: async (req, res) => {
    const { status } = req.body;

    if (!status) throw "All fields are required";

    const transaction = await transactionsModel.find({
      _id: req.params.id,
    });
    if (!transaction) throw "Transaction not found";

    const updatedTransaction = await transactionsModel.findOneAndUpdate(
      { _id: req.params.id },
      { status },
      { new: true }
    );
    res.status(200).json({
      message: "Transaction updated successfully",
      transaction: updatedTransaction,
    });
  },
};
module.exports = transactionsController;
