const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const validator = require("validator");
const jwtManager = require("../../managers/jwtManagers");

const register = async (req, res) => {
  const userModel = mongoose.model("users");

  const { username, email, phone, password, confirm_password } = req.body;
  if (!username || !email || !phone || !password || !confirm_password)
    throw "All fields are required";

  if (password.length < 8) throw "Password must be atleast 8 characters long ";

  if (password !== confirm_password) throw "Password does not match";

  if (!validator.isEmail(email)) throw "Email is not valid";
  // if (!validator.isStrongPassword(password)) {
  //   throw "Password is not strong enough";
  // }
  const containDuplicate = await userModel.findOne({
    email: email,
  });
  if (containDuplicate) throw "This email already exists";
  const hashedPassword = await bcrypt.hash(password, 12);

  const createdUser = await userModel.create({
    username: username,
    email: email,
    phone: phone,
    password: hashedPassword,
  });
  const accessToken = jwtManager(createdUser);
  //succes message
  res.status(201).json({
    message: "Registration Successful",
    accessToken: accessToken,
  });
};

module.exports = register;
