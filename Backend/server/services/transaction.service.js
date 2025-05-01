const userModel = require("../models/user.model");
const productsModel = require("../models/products.model");
const transactionsModel = require("../models/transaction.model");

const TransactionService = {
  async getAllTransactions() {
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

    return {
      transactions: transformedTransactions,
      products: products,
    };
  },

  async getTransactionStatus(userId) {
    let pending = 0,
      completed = 0,
      cancelled = 0;
      
    const transactions = await transactionsModel.find({
      user_id: userId,
    });

    transactions.forEach((transaction) => {
      if (transaction.status === "pending") pending++;
      if (transaction.status === "completed") completed++;
      if (transaction.status === "cancelled") cancelled++;
    });
    
    return {
      pending,
      completed,
      cancelled,
    };
  },

  async createIncomingOrder(orderData, userId) {
    const { product_id, name, customer, stock_level, total_price } = orderData;

    const transaction = await transactionsModel.create({
      product_id: product_id,
      user_id: userId,
      name: name,
      customer: customer,
      type: "incoming",
      stock_level: stock_level,
      total_price: total_price,
    });
    
    await productsModel.updateOne(
      { _id: product_id, user_id: userId },
      { $inc: { stock_level: stock_level } }
    );
    
    return transaction;
  },

  async createOutgoingOrder(orderData, userId) {
    const { product_id, customer, name, stock_level, total_price } = orderData;

    const product = await productsModel.findOne(
      {
        _id: product_id,
        user_id: userId,
      },
      {
        stock_level: 1,
      }
    );

    if (!product) {
      throw {
        status: 404,
        message: "Product not found"
      };
    }

    if (product.stock_level < stock_level) throw "Insufficient stock ";

    const transaction = await transactionsModel.create({
      product_id: product_id,
      user_id: userId,
      name: name,
      customer: customer,
      type: "outgoing",
      stock_level: stock_level,
      total_price: total_price,
    });

    await productsModel.updateOne(
      { _id: product_id, user_id: userId },
      { $inc: { stock_level: -stock_level } }
    );

    return transaction;
  },
  
  async updateTransaction(transactionId, updateData) {
    const { status } = updateData;

    if (!status) throw "All fields are required";

    const transaction = await transactionsModel.find({
      _id: transactionId,
    });
    
    if (!transaction) throw "Transaction not found";

    return await transactionsModel.findOneAndUpdate(
      { _id: transactionId },
      { status },
      { new: true }
    );
  }
};

module.exports = TransactionService;