const TransactionService = require("../../services/transaction.service");

const transactionsController = {
  GetAllTransactions: async (req, res) => {
    const result = await TransactionService.getAllTransactions();

    res.status(200).json({
      message: "Transactions retrieved successfully",
      data: result.transactions,
      products: result.products,
    });
  },

  TransactionStatus: async (req, res) => {
    const status = await TransactionService.getTransactionStatus(req.user._id);
    
    res.status(200).json({
      message: "Pending orders retrieved successfully",
      pending: status.pending,
      completed: status.completed,
      cancelled: status.cancelled,
    });
  },

  CreateIncomingOrder: async (req, res) => {
    await TransactionService.createIncomingOrder(req.body, req.user._id);
    
    res.status(201).json({
      message: "incoming order created successfully",
      status: "success",
    });
  },

  CreateOutgoingOrder: async (req, res) => {
    try {
      await TransactionService.createOutgoingOrder(req.body, req.user._id);
      
      res.status(201).json({
        message: "outgoing order created successfully",
        status: "success",
      });
    } catch (error) {
      if (error.status === 404) {
        return res.status(404).json({
          message: error.message,
          status: "error",
        });
      }
      throw error;
    }
  },
  
  UpdateOneTransaction: async (req, res) => {
    const updatedTransaction = await TransactionService.updateTransaction(
      req.params.id, 
      req.body
    );
    
    res.status(200).json({
      message: "Transaction updated successfully",
      transaction: updatedTransaction,
    });
  },
};

module.exports = transactionsController;
