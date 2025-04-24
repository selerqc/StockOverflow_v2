const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: [true, "User ID is required"],
    },
    name: {
      type: String,
      required: [true, "Name is required"],
      unique: true,
      trim: true,
    },

    description: {
      type: String,
      required: [true, "Description is required"],
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

const CategoryModel = mongoose.model("category", categorySchema);

module.exports = CategoryModel;
