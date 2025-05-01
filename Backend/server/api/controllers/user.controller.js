const UserService = require("../../services/user.service");

const userController = {
  CreateUser: async (req, res) => {
    const createdUser = await UserService.createUser(req.body);
    
    res.status(201).json({
      message: "New User added Successful",
      user: createdUser,
    });
  },

  GetAllUsers: async (req, res) => {
    const allUsers = await UserService.getAllUsers();
    
    res.status(200).json({
      message: "All Users fetched successfully",
      data: allUsers,
    });
  },

  UpdateUser: async (req, res) => {
    const { id } = req.params;
    const updatedUser = await UserService.updateUser(id, req.body);
    
    res.status(200).json({
      message: "User updated successfully",
      user: updatedUser,
    });
  },

  UpdateLastLogin: async (req, res) => {
    try {
      const updatedUser = await UserService.updateLastLogin(req.params.id);
      
      return res.status(200).json({
        status: "success",
        message: "Last login updated successfully",
        data: updatedUser,
      });
    } catch (error) {
      return res.status(500).json({
        status: "error",
        message: "Error updating last login",
        error: error.message,
      });
    }
  },
  
  UserDashboard: async (req, res) => {
    const dashboardData = await UserService.getUserDashboard(req.user._id);

    res.status(200).json({
      message: "success",
      data: dashboardData.user,
      products: dashboardData.products,
      transactions: dashboardData.transactions,
    });
  },
};

module.exports = userController;
