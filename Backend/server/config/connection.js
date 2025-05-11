const mongoose = require("mongoose");

module.exports = connection = async () => {
  try {
    await mongoose.connect(process.env.mongo_connection, {});
    console.log("connected to database.");
  } catch (error) {
    console.log(error, "could not connect database.");
    process.exit(1);
  }
};
