const express = require("express");
const cors = require("cors");
const path = require("path");

const app = express();

app.use(cors());
app.use(express.json());


app.use(express.static("./public"))
// API Routes
const videoRoutes = require("../routes/video.route");
app.use("/api/video", videoRoutes);

// Serve frontend build
app.use(express.static(path.join(__dirname, "../frontend/dist")));

// Catch all → React
app.get("*name", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/dist/index.html"));
});

module.exports = app;
