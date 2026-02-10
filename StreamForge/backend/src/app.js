const express = require("express");
const cors = require("cors");
const path = require("path");

const app = express();

// ========================================
// MIDDLEWARE
// ========================================
app.use(cors({
  origin: process.env.NODE_ENV === "production" 
    ? process.env.FRONTEND_URL || "*"
    : "http://localhost:3000",
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// ========================================
// API ROUTES (PEHLE API ROUTES)
// ========================================
const videoRoutes = require("../routes/video.route");
app.use("/api", videoRoutes);  // ✅ Changed from /api/videos to /api

// ========================================
// STATIC FILES (BAAD MEIN STATIC FILES)
// ========================================
// Serve public folder (for assets like images, etc)
app.use(express.static(path.join(__dirname, "../public")));

// Serve frontend build (React/Vite build)
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../../frontend/dist")));
  
  // Catch-all route → Send React app
  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../../frontend/dist/index.html"));
  });
}

// ========================================
// ERROR HANDLING
// ========================================
app.use((err, req, res, next) => {
  console.error("❌ Error:", err.stack);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal server error",
    error: process.env.NODE_ENV === "production" ? undefined : err.stack
  });
});

// 404 handler for API routes
app.use("/api/*", (req, res) => {
  res.status(404).json({
    success: false,
    message: "API endpoint not found"
  });
});

module.exports = app;