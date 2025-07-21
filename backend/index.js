const express = require("express");
const Random = require("./models/randModel");
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
app.get("/", (req, resp) => {
  resp.send("hello from express");
});
app.listen(port, () => {
  console.log(`app runnning on ${port}`);
});
