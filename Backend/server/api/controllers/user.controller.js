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
  GetEmployee: async (req, res) => {
    const allEmployee = await UserService.getEmployee();
    
    res.status(200).json({
      message: "All Employee fetched successfully",
      data: allEmployee,
    });
  },
  UpdateUser: async (req, res) => {

    const updatedUser = await UserService.updateUser(req.params.id, req.body);
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
  updateUserLogout: async (req, res) => {
    try {
      const updatedUser = await UserService.updateUserLogout(req.params.id);
      
      return res.status(200).json({
        status: "success",
        message: "User logged out successfully",
        data: updatedUser,
      });
    } catch (error) {
      return res.status(500).json({
        status: "error",
        message: "Error logging out user",
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

  AddManyEmployees: async (req, res) => {
    const users = Array.isArray(req.body) ? req.body : [];

    const createdUsers = await UserService.addManyEmployee(users);

    res.status(201).json({
      status: "success",
      message: "Users added successfully",
      users: createdUsers,
    });
  }

};

module.exports = userController;
