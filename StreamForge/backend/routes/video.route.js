const express = require("express");
const router = express.Router();
const path = require("path");
const fs = require("fs");
const YTDlpWrap = require("yt-dlp-wrap").default;

const binaryPath = path.join(__dirname, "../bin/yt-dlp");
const downloadDir = path.join(__dirname, "../downloads");

let ytDlpWrap = null;

// init
const init = () => {
  if (!fs.existsSync(binaryPath)) {
    console.error("yt-dlp binary missing");
    return false;
  }

  if (!fs.existsSync(downloadDir)) {
    fs.mkdirSync(downloadDir, { recursive: true });
  }

  if (process.platform !== "win32") {
    fs.chmodSync(binaryPath, "755");
  }

  ytDlpWrap = new YTDlpWrap(binaryPath);
  return true;
};

init();

// ========================================
// POST → /api/convert
// ========================================
router.post("/convert", async (req, res) => {
  const { videoUrl } = req.body;

  if (!videoUrl) {
    return res.status(400).json({ success: false, message: "videoUrl required" });
  }

  if (!ytDlpWrap && !init()) {
    return res.status(500).json({ success: false, message: "yt-dlp not ready" });
  }

  const fileName = `video_${Date.now()}.mp4`;
  const outputPath = path.join(downloadDir, fileName);

  try {
    const processYt = ytDlpWrap.exec([
      videoUrl,
      "-f",
      "best[ext=mp4]/best",
      "-o",
      outputPath,
      "--no-playlist",
    ]);

    await new Promise((resolve, reject) => {
      processYt.on("close", (c) => (c === 0 ? resolve() : reject()));
      processYt.on("error", reject);
    });

    res.json({
      success: true,
      fileName,
      downloadUrl: `/api/download/${fileName}`,
    });
  } catch (err) {
    if (fs.existsSync(outputPath)) fs.unlinkSync(outputPath);
    res.status(500).json({ success: false, message: "Download failed" });
  }
});

// ========================================
// GET → /api/download/:fileName
// ========================================
router.get("/download/:fileName", (req, res) => {
  const filePath = path.join(downloadDir, req.params.fileName);

  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ success: false, message: "File not found" });
  }

  res.download(filePath, () => {
    setTimeout(() => {
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    }, 5000);
  });
});

// ========================================
// GET → /api/health
// ========================================
router.get("/health", (req, res) => {
  res.json({
    status: "ok",
    ytDlpReady: !!ytDlpWrap,
  });
});

module.exports = router;
