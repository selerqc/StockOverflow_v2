const express = require("express");
const auth = require("../middleware/auth");
const checkPermission = require("../middleware/checkPermission");
const { PERMISSIONS } = require("../../config/roles");

const Transactions = require("../controllers/transaction.controller");
const transactionRoute = express.Router();

transactionRoute.use(auth);

transactionRoute
  .post("/outGoingOrder", checkPermission(PERMISSIONS.MANAGE_TRANSACTIONS), Transactions.CreateOutgoingOrder)
  .post("/incomingOrder", checkPermission(PERMISSIONS.MANAGE_TRANSACTIONS), Transactions.CreateIncomingOrder)
  .get("/getTransactions", checkPermission(PERMISSIONS.VIEW_TRANSACTIONS), Transactions.GetAllTransactions)
  .patch("/updateOneTransactions/:id", checkPermission(PERMISSIONS.MANAGE_TRANSACTIONS), Transactions.UpdateOneTransaction)
  .get("/getTransactionStatus", checkPermission(PERMISSIONS.VIEW_TRANSACTIONS), Transactions.TransactionStatus);
module.exports = transactionRoute;
