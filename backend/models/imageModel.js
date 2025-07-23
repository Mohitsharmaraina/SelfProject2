const mongoose = require("mongoose");

const imageSchema = new mongoose.Schema(
  {
    image: String,
  },
  {
    collection: "images",
  }
);

const ImageModel = mongoose.model("Images", imageSchema);
module.exports = ImageModel;
