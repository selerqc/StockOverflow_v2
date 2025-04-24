const mongoose = require("mongoose");
const updateOneAlert = async (req, res) => {
  const alertModel = mongoose.model("alert");

  const { is_read } = req.body;

  const updateAlert = await alertModel.findOneAndUpdate(
    { _id: req.params.id },
    {
      is_read: is_read,
    },
    {
      new: true,
    }
  );

  res.status(200).json({
    status: "success",
    message: "Alert updated successfully",
    updateAlert,
  });
};
module.exports = updateOneAlert;
