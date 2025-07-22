const express = require("express");
const Random = require("./models/randModel");
const mongoose = require("mongoose");
const Button = require("./models/buttonModel");
const User = require("./models//userModel");
const cors = require("cors");
require("./config.js");
require("dotenv").config();
const app = express();
app.use(express.json());
app.use(cors());

const port = process.env.PORT || 5000;

app.use(express.json()); // Ensure this is present above all routes

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
  const field = req.query.field;
  const value = req.query.value;

  // Map field names to actual paths
  if (field !== "" && value !== "") {
    try {
      const fieldPathMap = {
        gender: "gender",
        city: "contact.address.city",
        state: "contact.address.state",
      };
      const mongoField = fieldPathMap[field];
      if (!mongoField) {
        return resp.status(400).json({ message: "Invalid field" });
      }
      const matchCondition = {
        [mongoField]: value,
      };
      const response = await User.aggregate([
        { $match: matchCondition },
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
      resp.status(200).json({ message: "fetched", res: response });
    } catch (error) {
      console.log(error);
      resp.status(500).json({ message: "Server Error" });
    }
  } else {
    try {
      const response = await User.aggregate([
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
      resp.status(200).json({ message: "fetched", res: response });
    } catch (error) {
      console.log(error);
      resp.status(500).json({ message: "Server Error" });
    }
  }
});

app.get("/", (req, resp) => {
  resp.send("hello from express");
});
app.listen(port, () => {
  console.log(`app runnning on ${port}`);
});
