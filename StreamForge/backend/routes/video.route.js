const express = require("express");
const router = express.Router();
const path = require("path");
const fs = require("fs");
const YTDlpWrap = require("yt-dlp-wrap").default;


// ========================================
// yt-dlp SETUP (CRASH SAFE)
// ========================================
const binaryPath = path.join(__dirname, "../yt-dlp");

const ytDlpWrap = new YTDlpWrap(binaryPath);

// download binary when server starts
(async () => {
  try {
    if (!fs.existsSync(binaryPath)) {
      console.log("⬇ Downloading yt-dlp binary...");
      await YTDlpWrap.downloadFromGithub(binaryPath);
      console.log("✅ yt-dlp ready");
    } else {
      console.log("✅ yt-dlp already exists");
    }
  } catch (err) {
    console.log("❌ yt-dlp setup failed");
    console.log(err.message);
  }
})();


// ========================================
// POST → convert
// ========================================
router.post("/convert", async (req, res) => {
  const { videoUrl } = req.body;

  if (!videoUrl) {
    return res.status(400).json({ message: "videoUrl required" });
  }

  try {
    const downloadDir = path.join(__dirname, "../downloads");

    if (!fs.existsSync(downloadDir)) {
      fs.mkdirSync(downloadDir);
    }

    const fileName = `video_${Date.now()}.mp4`;
    const outputPath = path.join(downloadDir, fileName);

    console.log("🚀 Downloading:", videoUrl);

    await ytDlpWrap.execPromise([
      videoUrl,
      "-f",
      "bv*+ba/b",
      "-o",
      outputPath,
      "--recode-video",
      "mp4",
      "--no-playlist",
    ]);

    console.log("🔥 Download completed");

    res.json({
      message: "Downloaded successfully",
      fileName,
    });

  } catch (err) {
    console.log("❌ ERROR:", err.message);
    res.status(500).json({ message: "Download failed" });
  }
});


// ========================================
// GET → download
// ========================================
router.get("/download/:fileName", (req, res) => {
  const fileName = req.params.fileName;
  const filePath = path.join(__dirname, "../downloads", fileName);

  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ message: "File not found" });
  }

  res.download(filePath);
});

module.exports = router;
