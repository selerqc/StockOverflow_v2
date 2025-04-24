const userModel = require("../../models/user.model");
const productsModel = require("../../models/products.model");
const transactionsModel = require("../../models/transaction.model");
const userController = {
  CreateUser: async (req, res) => {
    const { username, email, phone, password, confirm_password } = req.body;
    if (!username || !email || !phone || !password || !confirm_password)
      throw "All fields are required";

    if (password.length < 8)
      throw "Password must be atleast 8 characters long ";

    if (password !== confirm_password) throw "Password does not match";

    const containDuplicate = await userModel.findOne({
      email: email,
    });
    if (containDuplicate) throw "This email already exists";
    const createdUser = await userModel.create({
      username: username,
      email: email,
      phone: phone,
      password: password,
    });
    //succes message
    res.status(201).json({
      message: "New User added Successful",
      user: createdUser,
    });
  },

  GetAllUsers: async (req, res) => {
    const allUsers = await userModel.find({});
    //success message
    res.status(200).json({
      message: "All Users fetched successfully",
      data: allUsers,
    });
  },

  UpdateUser: async (req, res) => {
    const { id } = req.params;
    const { username, email, role } = req.body;
    if (!username || !email || !role) throw "All fields are required";

    const user = await userModel.find({
      _id: id,
    });
    if (!user) throw "User not found";
    const updatedUser = await userModel.findOneAndUpdate(
      { _id: req.params.id },
      { username, email, role },
      { new: true }
    );
    res.status(200).json({
      message: "User updated successfully",
      user: updatedUser,
    });
  },
  UserDashboard: async (req, res) => {
    const getUser = await userModel
      .findOne({
        _id: req.user._id,
      })
      .select("-password");

    const products = await productsModel
      .find({
        user_id: req.user._id,
      })
      .sort("-createdAt");

    const transactions = await transactionsModel
      .find({
        user_id: req.user._id,
      })
      .populate("product_id", "name price")
      .populate("user_id", "username email")
      .sort("-createdAt");

    res.status(200).json({
      message: "success",
      data: getUser,
      products,
      transactions,
    });
  },
};

module.exports = userController;
