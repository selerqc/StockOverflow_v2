const AdminService = require("../../services/admin.service");

const AdminController = {
  GetAllProducts: async (req, res) => {
    const result = await AdminService.getAllProducts();

    res.status(200).json({
      status: "success",
      message: "Products retrieved successfully",
      data: result.products,
      productCount: result.productCount,
      lowStockCount: result.lowStockCount,
    });
  },
  
  GetAllTransactions: async (req, res) => {
    const result = await AdminService.getAllTransactions();

    res.status(200).json({
      message: "Transactions retrieved successfully",
      data: result.transactions,
      products: result.products,
      pending: result.pending,
    });
  },

  GetAllCategories: async (req, res) => {
    const categories = await AdminService.getAllCategories();
    
    res.status(200).json({
      status: "success",
      message: "Categories retrieved successfully",
      data: categories,
    });
  },
  
  AdminDashboard: async (req, res) => {
    const dashboardData = await AdminService.getAdminDashboard();
    
    res.status(200).json({
      status: "success",
      message: "Admin dashboard data retrieved successfully",
      data: dashboardData,
    });
  },
};

module.exports = AdminController;
