const express = require("express");

const login = require("../middleware/login");
const register = require("../middleware/register");
const auth = require("../middleware/auth");

const User = require("../modules/users/Users");
//routes
const userRoute = new express.Router();

userRoute.post("/register", register).post("/login", login);
//middleware
//everything under the authentication will be controlled

userRoute.use(auth);

//protected routes

userRoute
  .get("/dashboard", User.UserDashboard)
  .get("/getUsers", User.GetAllUsers)
  .post("/addNewUser", User.CreateUser)
  .patch("/updateUser/:id", User.UpdateUser);

module.exports = userRoute;
