const mongoose = require("mongoose");

const updateManyAlert = async (req, res) => {
  const alertModel = mongoose.model("alert");
  const { ids } = req.body;

  const updatedAlerts = await alertModel.updateMany(
    { _id: { $in: ids } },
    { is_read: true },
    { new: true }
  );

  res.status(200).json({
    status: "success",
    message: "Alerts updated successfully",
    updatedAlerts,
  });
};
module.exports = updateManyAlert;
