const express = require("express");
const auth = require("../middleware/auth");

const Transactions = require("../controllers/transaction.controller");
const transactionRoute = express.Router();

transactionRoute.use(auth);

transactionRoute
  .post("/outGoingOrder", Transactions.CreateOutgoingOrder)
  .post("/incomingOrder", Transactions.CreateIncomingOrder)
  .get("/getTransactions", Transactions.GetAllTransactions)
  .patch("/updateOneTransactions/:id", Transactions.UpdateOneTransaction)
  .get("/getTransactionStatus", Transactions.TransactionStatus);
module.exports = transactionRoute;
