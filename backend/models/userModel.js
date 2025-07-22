const mongoose = require("mongoose");

const User = new mongoose.Schema(
  {
    name: String,
    gender: String,
    city: String,
    country: String,
  },
  { collection: "users" }
);

module.exports = mongoose.model("Users", User);
