const mongoose = require("mongoose");
const getAlerts = async (req, res) => {
  const alertModel = mongoose.model("alert");

  const alerts = await alertModel.find({}).select({
    _v: 0,
  });

  const getUnreadAlerts = await alertModel.countDocuments({
    is_read: false,
    user_id: req.user._id,
  });

  res.status(200).json({
    status: "success",
    message: "Alerts retrieved successfully",
    data: alerts,
    unreadAlerts: getUnreadAlerts,
  });
};
module.exports = getAlerts;
