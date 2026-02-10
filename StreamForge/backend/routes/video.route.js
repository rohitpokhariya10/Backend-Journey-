const express = require("express");
const router = express.Router();
const path = require("path");
const fs = require("fs");
const YTDlpWrap = require("yt-dlp-wrap").default;

const ytDlpWrap = new YTDlpWrap();

router.post("/convert", async (req, res) => {
  const { videoUrl } = req.body;

  if (!videoUrl) {
    return res.status(400).json({ message: "videoUrl required" });
  }

  try {
    const downloadDir = path.join(__dirname, "../downloads");

    if (!fs.existsSync(downloadDir)) {
      fs.mkdirSync(downloadDir, { recursive: true });
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
    console.log("❌ FULL ERROR:", err.stderr || err.message);
    res.status(500).json({ message: "Download failed" });
  }
});

router.get("/download/:fileName", (req, res) => {
  const fileName = req.params.fileName;
  const filePath = path.join(__dirname, "../downloads", fileName);

  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ message: "File not found" });
  }

  res.download(filePath);
});

module.exports = router;
