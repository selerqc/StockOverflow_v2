const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jsonwebtoken = require("jsonwebtoken");
const jwtManager = require("../managers/jwtManagers");

const login = async (req, res) => {
  const usersModel = mongoose.model("users");
  const { email, password } = req.body;

  if (!email || !password) throw "Please provide email and password";

  const getUser = await usersModel.findOne({
    email: email,
  });
  if (!getUser) throw "This email does not exist in the system";
  const comparePassword = await bcrypt.compare(password, getUser.password);

  if (!comparePassword) throw "Password is incorrect";
  console.log(firstName, lastName, email, phone, password, role);
  const accessToken = jwtManager(getUser);

  res.status(200).json({
    status: "success",
    message: " Logged in successfully",
    accessToken: accessToken,
    data: {
      _id: getUser._id,
      username: getUser.username,
      email: getUser.email,
      phone: getUser.phone,
      role: getUser.role,
    },
  });
};

module.exports = login;
