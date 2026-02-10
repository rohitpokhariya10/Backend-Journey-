const express = require("express");
const cors = require("cors");
const path = require("path");

const app = express();

app.use(cors());
app.use(express.json());

// request log
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

// routes
const videoRoutes = require(path.join(__dirname, "../routes/video.route"));
app.use("/api", videoRoutes);

// root
app.get("/", (req, res) => {
  res.json({
    status: "running",
    api: "/api/health",
  });
});

// 404
app.use((req, res) => {
  res.status(404).json({ success: false, message: "API endpoint not found" });
});

module.exports = app;
