const mongoose = require("mongoose");

const Random = new mongoose.Schema(
  {
    sec: Number,
    randNo: Number,
  },
  { collection: "randoms" }
);
module.exports = mongoose.model("RandomData", Random);
