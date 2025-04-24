const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, "Username is required"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      match: [/.+@.+\..+/, "Please enter a valid email address"],
    },
    phone: {
      type: String,
      required: [true, "Phone number is required"],
      match: [/^\d{10,15}$/, "Please enter a valid phone number"],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
    },
    role: {
      type: String,
      required: [true, "Role is required"],
      enum: ["Business Owner", "Employee"],
      default: "Employee",
    },
    status: {
      type: String,
      required: [true, "Status is required"],
      enum: ["active", "inactive"],
      default: "inactive",
    },
  },
  {
    timestamps: true,
  }
);

const UserModel = mongoose.model("users", userSchema);

module.exports = UserModel;
