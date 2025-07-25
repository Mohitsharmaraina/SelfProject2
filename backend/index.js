const express = require("express");
const path = require("path");
const Random = require("./models/randModel");
const mongoose = require("mongoose");
const Button = require("./models/buttonModel");
const User = require("./models//userModel");
const upload = require("./middlewares/multer.middleware");
const { uploadOnCloudinary } = require("./utils/cloudinary");

const cors = require("cors");
require("./config.js");
require("dotenv").config();

const app = express();
app.use(express.json()); // Ensure this is present above all routes
app.use(cors());

const port = process.env.PORT || 5000;

const conn = mongoose.connection;

app.post("/upload", upload.single("file"), async (req, res) => {
  try {
    if (!req.file || !req.file.path) {
      return res.status(400).json({ message: "No file provided" });
    }

    const cloudinaryResponse = await uploadOnCloudinary(req.file.path);
    res.status(200).json({ url: cloudinaryResponse.secure_url });
  } catch (error) {
    res.status(500).json({ error: "Upload failed" });
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

// fetching unique states
app.get("/search/states", async (req, resp) => {
  try {
    const response = await User.aggregate([
      {
        $group: { _id: null, states: { $addToSet: "$contact.address.state" } },
      },
    ]);
    resp.status(200).json({ result: response });
  } catch (error) {
    console.log(error);
    resp.status(500).json({ message: "Internal server error" });
  }
});

// fetching cities for user selected states

app.get("/search/cities", async (req, resp) => {
  // console.log(req.query.state);
  if (!req.query.state) {
    return resp.status(400).json({ message: "state is not found in query" });
  }
  try {
    const response = await User.aggregate([
      { $match: { "contact.address.state": req.query.state } },
      {
        $group: { _id: null, cities: { $addToSet: "$contact.address.city" } },
      },
    ]);
    resp.status(200).json({ result: response });
  } catch (error) {
    console.log(error);
    resp.status(500).json({ message: "Internal server error" });
  }
});

// api for fetching users using all filters combined
app.get("/search/user", async (req, resp) => {
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
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, "public/Images");
//   },
//   filename: (req, file, cb) => {
//     cb(
//       null,
//       file.fieldname + "_" + Date.now() + path.extname(file.originalname)
//     );
//   },
// });

// ROUTE TO GET ALL FILES

// app.get("/files", async (req, res) => {
//   gfs.files.find().toArray((err, files) => {
//     if (!files || files.length === 0) {
//       return res.status(404).json({ message: "No files found" });
//     }
//     res.json(files);
//   });
// });

// multer gridFs not working

/*


// Init gfs
let gfs;
conn.once("open", () => {
  console.log("MongoDB connected");
  gfs = Grid(conn.db, mongoose.mongo);
  gfs.collection("uploads"); // Set collection name
});

// configure multer-gridfs-storage
const storage = new GridFsStorage({
  url: process.env.MONGO_URI,
  file: (req, file) => {
    return {
      filename: `${Date.now()}-${file.originalname}`,
      bucketName: "uploads", // Same as gfs.collection()
    };
  },
});

// const upload = multer({ storage });

// restricted file size to 5mb and checking type of files
const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    const allowed = [
      "image/jpeg",
      "image/png",
      "image/webp",
      "application/pdf",
    ];
    if (allowed.includes(file.mimetype)) cb(null, true);
    else cb(new Error("Invalid file type"), false);
  },
  limits: { fileSize: 3 * 1024 * 1024 },
}); // CONFIGURED MULTER TO STORE DIRECTLY IN MONGODB USING GFS
app.post("/upload", upload.single("file"), async (req, res) => {
  console.log("req.file:", req.file);

  if (!req.file) {
    return res.status(400).json({ error: "File upload failed" });
  }
  res.status(201).json({
    file: req.file,
    message: "File uploaded successfully",
  });
});
*/
