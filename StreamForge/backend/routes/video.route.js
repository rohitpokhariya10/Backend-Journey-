const express = require("express");
const router = express.Router();
const path = require("path");
const fs = require("fs");
const YTDlpWrap = require("yt-dlp-wrap").default;

// ========================================
// CONFIGURATION
// ========================================
const getTmpDir = () => {
  // Render.com uses /tmp, local uses project directory
  return process.env.RENDER ? "/tmp" : path.join(__dirname, "../");
};

const binaryPath = path.join(getTmpDir(), "yt-dlp");
const downloadDir = path.join(getTmpDir(), "downloads");

let ytDlpWrap;
let isInitializing = false;

// ========================================
// yt-dlp INITIALIZATION
// ========================================
const initYtDlp = async () => {
  // Prevent multiple simultaneous initializations
  if (isInitializing) {
    console.log("⏳ yt-dlp initialization already in progress...");
    while (isInitializing) {
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    return !!ytDlpWrap;
  }

  isInitializing = true;
  console.log("🔧 Initializing yt-dlp...");

  try {
    // Create downloads directory
    if (!fs.existsSync(downloadDir)) {
      fs.mkdirSync(downloadDir, { recursive: true });
      console.log("📁 Downloads directory created:", downloadDir);
    }

    // Download yt-dlp binary if not exists
    if (!fs.existsSync(binaryPath)) {
      console.log("⬇️  Downloading yt-dlp binary from GitHub...");
      await YTDlpWrap.downloadFromGithub(binaryPath);
      
      // Make executable on Unix systems
      if (process.platform !== "win32") {
        fs.chmodSync(binaryPath, "755");
        console.log("✅ Binary made executable");
      }
      
      console.log("✅ yt-dlp binary downloaded successfully");
    } else {
      console.log("✅ yt-dlp binary already exists");
    }

    // Initialize wrapper
    ytDlpWrap = new YTDlpWrap(binaryPath);
    console.log("✅ yt-dlp wrapper initialized");
    
    isInitializing = false;
    return true;
    
  } catch (err) {
    console.error("❌ yt-dlp initialization failed:", err.message);
    isInitializing = false;
    return false;
  }
};

// Initialize on server start
initYtDlp();

// ========================================
// CLEANUP OLD FILES
// ========================================
const cleanupOldFiles = () => {
  if (!fs.existsSync(downloadDir)) return;
  
  try {
    const files = fs.readdirSync(downloadDir);
    const now = Date.now();
    let cleanedCount = 0;
    
    files.forEach(file => {
      try {
        const filePath = path.join(downloadDir, file);
        const stats = fs.statSync(filePath);
        const fileAge = now - stats.mtimeMs;
        
        // Delete files older than 30 minutes
        if (fileAge > 30 * 60 * 1000) {
          fs.unlinkSync(filePath);
          cleanedCount++;
          console.log("🗑️  Cleaned up old file:", file);
        }
      } catch (err) {
        console.error("Error cleaning file:", file, err.message);
      }
    });
    
    if (cleanedCount > 0) {
      console.log(`✅ Cleaned up ${cleanedCount} old file(s)`);
    }
  } catch (err) {
    console.error("❌ Cleanup error:", err.message);
  }
};

// Run cleanup every 30 minutes
setInterval(cleanupOldFiles, 30 * 60 * 1000);

// ========================================
// HELPER: Validate YouTube URL
// ========================================
const isValidYouTubeUrl = (url) => {
  try {
    const urlObj = new URL(url);
    return (
      urlObj.hostname.includes("youtube.com") ||
      urlObj.hostname.includes("youtu.be")
    );
  } catch {
    return false;
  }
};

// ========================================
// POST → /api/convert (Download Video)
// ========================================
router.post("/convert", async (req, res) => {
  const { videoUrl } = req.body;

  // Validation
  if (!videoUrl) {
    return res.status(400).json({ 
      success: false,
      message: "videoUrl is required" 
    });
  }

  if (!isValidYouTubeUrl(videoUrl)) {
    return res.status(400).json({
      success: false,
      message: "Invalid YouTube URL. Please provide a valid YouTube link."
    });
  }

  // Check if yt-dlp is ready
  if (!ytDlpWrap) {
    console.log("⚠️  yt-dlp not ready, initializing...");
    const initialized = await initYtDlp();
    
    if (!initialized) {
      return res.status(503).json({
        success: false,
        message: "Service temporarily unavailable. Please try again in a moment."
      });
    }
  }

  const startTime = Date.now();
  const fileName = `video_${Date.now()}.mp4`;
  const outputPath = path.join(downloadDir, fileName);

  try {
    console.log("=================================");
    console.log("🎬 New Download Request");
    console.log("🔗 URL:", videoUrl);
    console.log("📁 Output:", fileName);
    console.log("=================================");

    // Download video
    const ytDlpProcess = ytDlpWrap.exec([
      videoUrl,
      "-f", "best[ext=mp4]/best",
      "-o", outputPath,
      "--no-playlist",
      "--no-warnings",
      "--no-check-certificate",
      "--socket-timeout", "30",
      "--retries", "3",
      // Limit file size (adjust as needed)
      "--max-filesize", "500M",
    ]);

    // Handle progress (optional)
    ytDlpProcess.on("progress", (progress) => {
      console.log("📊 Progress:", progress.percent, "%");
    });

    // Wait for completion
    await new Promise((resolve, reject) => {
      ytDlpProcess.on("close", (code) => {
        if (code === 0) resolve();
        else reject(new Error(`yt-dlp exited with code ${code}`));
      });
      ytDlpProcess.on("error", reject);
    });

    // Verify file was created
    if (!fs.existsSync(outputPath)) {
      throw new Error("Video file was not created");
    }

    const fileStats = fs.statSync(outputPath);
    const downloadTime = ((Date.now() - startTime) / 1000).toFixed(2);

    console.log("=================================");
    console.log("✅ Download Complete");
    console.log("⏱️  Time:", downloadTime, "seconds");
    console.log("📦 Size:", (fileStats.size / (1024 * 1024)).toFixed(2), "MB");
    console.log("=================================");

    res.json({
      success: true,
      message: "Video downloaded successfully",
      data: {
        fileName,
        fileSize: fileStats.size,
        fileSizeMB: (fileStats.size / (1024 * 1024)).toFixed(2),
        downloadTime: `${downloadTime}s`,
        downloadUrl: `/api/download/${fileName}`
      }
    });

  } catch (err) {
    console.error("=================================");
    console.error("❌ Download Failed");
    console.error("Error:", err.message);
    console.error("=================================");

    // Clean up partial file if exists
    if (fs.existsSync(outputPath)) {
      try {
        fs.unlinkSync(outputPath);
        console.log("🗑️  Cleaned up partial download");
      } catch (cleanupErr) {
        console.error("Cleanup error:", cleanupErr.message);
      }
    }

    res.status(500).json({
      success: false,
      message: "Failed to download video",
      error: err?.stderr || err?.message || "Unknown error occurred"
    });
  }
});

// ========================================
// GET → /api/download/:fileName (Download File)
// ========================================
router.get("/download/:fileName", (req, res) => {
  const { fileName } = req.params;
  
  // Security: Prevent directory traversal
  if (fileName.includes("..") || fileName.includes("/") || fileName.includes("\\")) {
    return res.status(400).json({ 
      success: false,
      message: "Invalid filename" 
    });
  }

  const filePath = path.join(downloadDir, fileName);

  console.log("📥 Download request:", fileName);

  // Check if file exists
  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ 
      success: false,
      message: "File not found or has expired" 
    });
  }

  try {
    const stats = fs.statSync(filePath);
    
    // Set headers
    res.setHeader('Content-Type', 'video/mp4');
    res.setHeader('Content-Length', stats.size);
    res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);
    res.setHeader('Cache-Control', 'no-cache');

    // Create read stream
    const fileStream = fs.createReadStream(filePath);
    
    // Handle stream errors
    fileStream.on('error', (err) => {
      console.error("❌ Stream error:", err.message);
      if (!res.headersSent) {
        res.status(500).json({
          success: false,
          message: "Error streaming file"
        });
      }
    });

    // Auto-delete after successful download
    fileStream.on('end', () => {
      console.log("✅ File sent successfully:", fileName);
      
      // Delete after 5 seconds
      setTimeout(() => {
        if (fs.existsSync(filePath)) {
          try {
            fs.unlinkSync(filePath);
            console.log("🗑️  Auto-deleted:", fileName);
          } catch (err) {
            console.error("Delete error:", err.message);
          }
        }
      }, 5000);
    });

    // Pipe file to response
    fileStream.pipe(res);
    
  } catch (err) {
    console.error("❌ Download error:", err.message);
    res.status(500).json({
      success: false,
      message: "Failed to download file"
    });
  }
});

// ========================================
// GET → /api/health (Health Check)
// ========================================
router.get("/health", (req, res) => {
  const health = {
    status: "healthy",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    ytDlp: {
      ready: !!ytDlpWrap,
      binaryExists: fs.existsSync(binaryPath),
      binaryPath: binaryPath
    },
    storage: {
      downloadDirExists: fs.existsSync(downloadDir),
      downloadDir: downloadDir,
      filesCount: fs.existsSync(downloadDir) ? fs.readdirSync(downloadDir).length : 0
    },
    system: {
      platform: process.platform,
      nodeVersion: process.version,
      memory: {
        used: (process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2) + " MB",
        total: (process.memoryUsage().heapTotal / 1024 / 1024).toFixed(2) + " MB"
      }
    }
  };

  res.json(health);
});

// ========================================
// POST → /api/cleanup (Manual Cleanup)
// ========================================
router.post("/cleanup", (req, res) => {
  try {
    cleanupOldFiles();
    res.json({
      success: true,
      message: "Cleanup completed"
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Cleanup failed",
      error: err.message
    });
  }
});

module.exports = router;