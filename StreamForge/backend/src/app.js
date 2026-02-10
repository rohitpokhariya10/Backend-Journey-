const express = require("express");
const cors = require("cors");
const path = require("path");

const app = express();

// ========================================
// CORS CONFIGURATION
// ========================================
const corsOptions = {
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);
    
    const allowedOrigins = [
      'http://localhost:3000',
      'http://localhost:5173',
      process.env.FRONTEND_URL,
    ].filter(Boolean);
    
    if (allowedOrigins.indexOf(origin) !== -1 || process.env.NODE_ENV === 'production') {
      callback(null, true);
    } else {
      callback(null, true);
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

app.use(cors(corsOptions));

// ========================================
// MIDDLEWARE
// ========================================
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// ========================================
// API ROUTES
// ========================================
const videoRoutes = require("../routes/video.route");
app.use("/api", videoRoutes);

// ========================================
// SERVE FRONTEND (PRODUCTION)
// ========================================
if (process.env.NODE_ENV === "production") {
  const frontendPath = path.join(__dirname, "../../frontend/dist");
  const fs = require('fs');
  
  if (fs.existsSync(frontendPath)) {
    console.log('✅ Serving frontend from:', frontendPath);
    app.use(express.static(frontendPath));
    
    // Catch-all for React Router (excluding /api routes)
    app.get(/^\/(?!api).*/, (req, res) => {
      res.sendFile(path.join(frontendPath, "index.html"));
    });
  } else {
    console.log('⚠️  Frontend build not found - API only mode');
  }
} else {
  // Development - Root endpoint
  app.get("/", (req, res) => {
    res.json({
      status: "running",
      message: "StreamForge API",
      version: "1.0.0",
      environment: process.env.NODE_ENV || "development",
      endpoints: {
        health: "GET /api/health",
        convert: "POST /api/convert",
        download: "GET /api/download/:fileName"
      }
    });
  });
}

// ========================================
// ERROR HANDLING
// ========================================

// Global error handler
app.use((err, req, res, next) => {
  console.error("❌ Error:", err.stack);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal server error",
    error: process.env.NODE_ENV === "production" ? undefined : err.stack
  });
});

// ✅ FIXED: 404 handler (no wildcard)
app.use((req, res) => {
  // Only send 404 JSON for API routes
  if (req.path.startsWith('/api')) {
    res.status(404).json({
      success: false,
      message: "API endpoint not found"
    });
  } else {
    // For non-API routes in development
    res.status(404).json({
      success: false,
      message: "Route not found"
    });
  }
});

module.exports = app;