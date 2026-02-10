const express = require("express");
const router = express.Router();
const path = require("path");
const fs = require("fs");
const YTDlpWrap = require("yt-dlp-wrap").default;

// create instance
const ytDlpWrap = new YTDlpWrap();

// 🔥 VERY IMPORTANT FOR RENDER
// download binary automatically
ytDlpWrap
  .downloadFromGithub()
  .then(() => console.log("✅ yt-dlp ready"))
  .catch(() => console.log("❌ yt-dlp download failed"));

// =============================
// POST → convert & download
// =============================
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

    console.log("🔥 Done");

    res.json({
      message: "Downloaded successfully",
      fileName,
    });
  } catch (err) {
    console.log("❌ ERROR:", err);
    res.status(500).json({ message: "Download failed" });
  }
});

// =============================
// GET → download file
// =============================
router.get("/download/:fileName", (req, res) => {
  const fileName = req.params.fileName;
  const filePath = path.join(__dirname, "../downloads", fileName);

  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ message: "File not found" });
  }

  res.download(filePath);
});

module.exports = router;
