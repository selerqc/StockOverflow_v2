const express = require("express");

const login = require("../middleware/login");
const register = require("../middleware/register");
const auth = require("../middleware/auth");
const checkPermission = require("../middleware/checkPermission");
const { PERMISSIONS } = require("../../config/roles");

const User = require("../controllers/user.controller");
//routes
const userRoute = new express.Router();

userRoute
  .post("/register", register)
  .post("/login", login)
  .patch("/updateLastLogin/:id", User.UpdateLastLogin)
  .post("/addManyEmployee", auth, checkPermission(PERMISSIONS.CREATE_USER), User.AddManyEmployees)

//middleware
//everything under the authentication will be controlled

userRoute.use(auth);

//protected routes

userRoute
  .get("/dashboard", User.UserDashboard)
  .get("/getUsers", checkPermission(PERMISSIONS.VIEW_USERS), User.GetAllUsers)
  .post("/addNewUser", checkPermission(PERMISSIONS.CREATE_USER), User.CreateUser)
  .patch("/updateUser/:id", checkPermission(PERMISSIONS.UPDATE_USER), User.UpdateUser)
  .patch("/updateUserLogout/:id", User.updateUserLogout)
  .get("/getEmployee", checkPermission(PERMISSIONS.VIEW_EMPLOYEES), User.GetEmployee)
module.exports = userRoute;
