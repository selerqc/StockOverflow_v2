const mongoose = require("mongoose");

const alertSchema = new mongoose.Schema(
  {
  
    type: {
      type: String,
      required: [true, "Type is required"],
      trim: true,
    },
    message: {
      type: String,
      required: [true, "Message is required"],
      trim: true,
    },
    date: {
      type: Date,
      default: Date.now,
    },
    is_read: {
      type: Boolean,
      default: false,
    },
    priority: {
      type: String,
      enum: ["low", "medium", "high"],
      default: "low",
    },
  },
  {
    timestamps: true,
  }
);

const AlertModel = mongoose.model("alert", alertSchema);

module.exports = AlertModel;
