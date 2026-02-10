const express = require("express");
const router = express.Router();
const path = require("path");
const fs = require("fs");
const YTDlpWrap = require("yt-dlp-wrap").default;


// ⭐ binary path jaha download hoga
const ytDlpPath = path.join(__dirname, "../yt-dlp");

// ⭐ create instance
const ytDlpWrap = new YTDlpWrap(ytDlpPath);


// ⭐ DOWNLOAD yt-dlp if not exist
(async () => {
  if (!fs.existsSync(ytDlpPath)) {
    console.log("⬇ Downloading yt-dlp binary...");
    await YTDlpWrap.downloadFromGithub(ytDlpPath);
    console.log("✅ yt-dlp ready");
  }
})();


// =============================
// POST convert
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
// GET download
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
