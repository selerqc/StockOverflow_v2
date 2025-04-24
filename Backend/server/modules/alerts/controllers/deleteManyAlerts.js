const mongoose = require("mongoose");

const deleteManyAlerts = async (req, res) => {
  const alertModel = mongoose.model("alert");

  const deleteResult = await alertModel.deleteMany({
    user_id: req.user._id,
  });

  res.status(200).json({
    status: "success",
    message: "Alerts deleted successfully",
    deleteResult,
  });
};

module.exports = deleteManyAlerts;
