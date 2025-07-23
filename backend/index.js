const express = require("express");
const multer = require("multer");
const path = require("path");
const { GridFsStorage } = require("multer-gridfs-storage");
const Grid = require("gridfs-stream");
const Random = require("./models/randModel");
const mongoose = require("mongoose");
const Button = require("./models/buttonModel");
const User = require("./models//userModel");
const ImageModel = require("./models/imageModel");
const cors = require("cors");
require("./config.js");
require("dotenv").config();
const app = express();

app.use(cors());

const port = process.env.PORT || 5000;
const conn = mongoose.connection;

app.use(express.json()); // Ensure this is present above all routes

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/Images");
  },
  filename: (req, file, cb) => {
    cb(
      null,
      file.fieldname + "_" + Date.now() + path.extname(file.originalname)
    );
  },
});
const upload = multer({ storage: storage }); // CONFIGURED MULTER TO STORE DIRECTLY IN MONGODB USING GFS
app.post("/upload", upload.single("file"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "File upload failed" });
  }
  try {
    ImageModel.create({ image: req.file.filename });
    res.status(200).json({ file: req.file });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

app.get("/getImage", async (req, resp) => {
  try {
    const response = await ImageModel.find();
    const result = await response.json();
    resp.status(200).json({ data: result });
  } catch (error) {
    console.log(error);
  }
});

app.post("/rand", async (req, res) => {
  try {
    console.log("req body contains:", req.body);
    const result = await Random.insertMany(req.body); // ✅ use insertMany for arrays
    res.status(200).json({
      message: "Data saved",
      count: result.length,
      data: result,
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.get("/rand", async (req, resp) => {
  try {
    const result = await Random.find();
    resp.status(200).json({
      message: "Data Found",
      data: result,
    });
  } catch (error) {
    console.log(error);
  }
});

app.delete("/rand", async (req, resp) => {
  try {
    const result = await Random.deleteMany({});
    resp.status(200).json({
      message: "deleted",
      status: result,
    });
  } catch (error) {
    console.log(error);
  }
});

app.put("/btnStatus", async (req, resp) => {
  console.log(req.body);
  try {
    const result = await Button.updateOne(
      { _id: new mongoose.Types.ObjectId("687f1ef767f356eb0ba645e6") },
      { $set: { status: req.body.status } }
    );
    resp.status(200).json({
      message: "updated",
      status: result,
    });
  } catch (error) {
    console.log(error);
  }
});
app.get("/btnStatus", async (req, resp) => {
  try {
    const result = await Button.find({
      _id: new mongoose.Types.ObjectId("687f1ef767f356eb0ba645e6"),
    });
    resp.status(200).json({
      message: "found",
      status: result,
    });
  } catch (error) {
    console.log(error);
  }
});

app.get("/user", async (req, resp) => {
  console.log(req.query);
  const { gender, city, state } = req.query;
  // console.log(gender, city, state);
  // Build dynamic MongoDB query
  const query = {};
  if (gender) query["gender"] = gender;
  if (city) query["contact.address.city"] = city;
  if (state) query["contact.address.state"] = state;

  try {
    const result = await User.aggregate([
      { $match: query },
      {
        $group: {
          _id: null,
          names: {
            $push: {
              name: "$name",
              phone: { $arrayElemAt: ["$contact.phone", 0] },
            },
          },
        },
      },
    ]);

    resp.json({ res: result });
  } catch (err) {
    console.error(err);
    resp.status(500).json({ error: "Server Error" });
  }
});

app.get("/", (req, resp) => {
  resp.send("hello from express");
});
app.listen(port, () => {
  console.log(`app runnning on ${port}`);
});
