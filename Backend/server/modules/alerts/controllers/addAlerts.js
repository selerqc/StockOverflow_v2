const mongoose = require("mongoose");
const addAlerts = async (req, res) => {
  const alertModel = mongoose.model("alert");

  const { type, message, priority, date } = req.body;

  const addAlert = await alertModel.create({
    user_id: req.user._id,
    type,
    message,
    date: date,
    is_read: false,
    priority: priority,
  });
  console.log(addAlert);

  res.status(201).json({
    status: "success",
    message: "Alert added successfully",
    addAlert,
  });
};
module.exports = addAlerts;
