const mongoose = require("mongoose");

const Button = new mongoose.Schema(
  {
    status: Boolean,
  },
  { collection: "button" }
);

module.exports = mongoose.model("Buttons", Button);
