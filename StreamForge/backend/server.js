const app = require("./src/app");

const PORT = process.env.PORT || 5000;

// ========================================
// START SERVER
// ========================================
const server = app.listen(PORT, () => {
  console.log("=================================");
  console.log("🚀 StreamForge Server Started");
  console.log("=================================");
  console.log(`📍 Environment: ${process.env.NODE_ENV || "development"}`);
  console.log(`🌐 Port: ${PORT}`);
  console.log(`🔗 Local: http://localhost:${PORT}`);
  console.log(`📡 API: http://localhost:${PORT}/api`);
  console.log("=================================");
});

// ========================================
// GRACEFUL SHUTDOWN
// ========================================
const gracefulShutdown = () => {
  console.log("\n⚠️  Shutting down gracefully...");
  server.close(() => {
    console.log("✅ Server closed");
    process.exit(0);
  });

  // Force shutdown after 10 seconds
  setTimeout(() => {
    console.error("❌ Forced shutdown");
    process.exit(1);
  }, 10000);
};

process.on("SIGTERM", gracefulShutdown);
process.on("SIGINT", gracefulShutdown);

// ========================================
// ERROR HANDLERS
// ========================================
process.on("uncaughtException", (err) => {
  console.error("❌ Uncaught Exception:", err);
  process.exit(1);
});

process.on("unhandledRejection", (err) => {
  console.error("❌ Unhandled Rejection:", err);
  process.exit(1);
});
