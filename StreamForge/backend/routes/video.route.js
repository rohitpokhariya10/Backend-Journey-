const express = require("express");
const router = express.Router();
const { exec } = require("child_process");
const path = require("path");
const fs = require("fs");

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

    const ytdlpPath = `"C:\\Users\\ROHIT\\Downloads\\yt-dlp.exe"`;

    // ✅ EXACT exe path
    const ffmpegPath =
      `"C:\\Users\\ROHIT\\Downloads\\ffmpeg-8.0.1-essentials_build\\ffmpeg-8.0.1-essentials_build\\bin\\ffmpeg.exe"`;

    // 🏆 GOLD COMMAND
    const command = `${ytdlpPath} -f "bv*+ba/b" --ffmpeg-location ${ffmpegPath} --recode-video mp4 --no-playlist -o "${outputPath}" "${videoUrl}"`;

    console.log("🚀 Running:");
    console.log(command);

    exec(command, (error, stdout, stderr) => {
      if (error) {
        console.log("❌ ERROR:", stderr);
        return res.status(500).json({ message: "Download failed" });
      }

      console.log("🔥 VIDEO + AUDIO PERFECT");

      res.json({
        message: "Downloaded successfully",
        fileName,
      });
    });

  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server error" });
  }
});

router.get("/download/:fileName", (req, res) => {
  const fileName = req.params.fileName;

  const filePath = path.join(__dirname, "../downloads", fileName);

  res.download(filePath, fileName, (err) => {
    if (err) {
      console.log("Download error ❌", err);
      res.status(500).json({ message: "File not found" });
    }
  });
});

module.exports = router;
