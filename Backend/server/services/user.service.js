const userModel = require("../models/user.model");
const productsModel = require("../models/products.model");
const transactionsModel = require("../models/transaction.model");

const UserService = {
  async createUser(userData) {
    const { username, email, phone, password, confirm_password } = userData;
    
    if (!username || !email || !phone || !password || !confirm_password)
      throw "All fields are required";

    if (password.length < 8)
      throw "Password must be atleast 8 characters long ";

    if (password !== confirm_password) throw "Password does not match";

    const containDuplicate = await userModel.findOne({
      email: email,
    });
    if (containDuplicate) throw "This email already exists";
    
    return await userModel.create({
      username: username,
      email: email,
      phone: phone,
      password: password,
    });
  },

  async getAllUsers() {
    return await userModel.find({});
  },

  async updateUser(userId, userData) {
    const { username, email, role } = userData;
    if (!username || !email || !role) throw "All fields are required";

    const user = await userModel.find({
      _id: userId,
    });
    if (!user) throw "User not found";
    
    return await userModel.findOneAndUpdate(
      { _id: userId },
      { username, email, role },
      { new: true }
    );
  },

  async updateLastLogin(userId) {
    try {
      return await userModel.findOneAndUpdate(
        { _id: userId },
        {
          updatedAt: Date.now(),
        }
      );
    } catch (error) {
      throw error;
    }
  },
  
  async getUserDashboard(userId) {
    const getUser = await userModel
      .findOne({
        _id: userId,
      })
      .select("-password");

    const products = await productsModel
      .find({
        user_id: userId,
      })
      .sort("-createdAt");

    const transactions = await transactionsModel
      .find({
        user_id: userId,
      })
      .populate("product_id", "name price")
      .populate("user_id", "username email")
      .sort("-createdAt");

    return {
      user: getUser,
      products,
      transactions,
    };
  },
};

module.exports = UserService;