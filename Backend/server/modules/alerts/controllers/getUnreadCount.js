const mongoose = require("mongoose");

const getUnreadCount = async (req, res) => {
  try {
    const alertsModel = mongoose.model("alert");
    const unreadCount = await alertsModel.countDocuments({
      user_id: req.user._id,
      is_read: false,
    });
    res.status(200).json({ unreadCount });
  } catch (error) {
    console.error("Error fetching unread alerts count:", error);
    res.status(500).json({ message: "Error fetching unread alerts count" });
  }
};

module.exports = getUnreadCount;
