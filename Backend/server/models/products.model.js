const mongoose = require("mongoose");

const productsSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: true,
    },
    category_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "category",
      required: true,
    },
    name: {
      type: String,
      required: [true, "Name is required"],
      unique: true,
      trim: true,
    },
    price: {
      type: Number,
      required: [true, "Price is required"],
      min: [0, "Price cannot be negative"],
    },
    stock_level: {
      type: Number,
      required: [true, "Stock level is required"],
      min: [0, "Stock level cannot be negative"],
    },
    sku: {
      type: String,
      required: [true, "SKU is required"],
      unique: true,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

const ProductsModel = mongoose.model("products", productsSchema);

module.exports = ProductsModel;
