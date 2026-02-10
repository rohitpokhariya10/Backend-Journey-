import { useState, useEffect } from "react";
import {
  Download,
  Video,
  CheckCircle,
  AlertCircle,
  Loader2,
  Github,
  ExternalLink,
  Moon,
  Sun,
} from "lucide-react";

export default function VideoConverter() {
  const [videoUrl, setVideoUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [fileName, setFileName] = useState("");
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("theme");
    if (saved === "dark") {
      setDarkMode(true);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("theme", darkMode ? "dark" : "light");
  }, [darkMode]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!videoUrl.trim()) {
      setError("Please enter a valid video URL");
      return;
    }

    setLoading(true);
    setError("");
    setSuccess(false);

    try {
      // STEP 1 → Convert
      const response = await fetch(
        "http://localhost:3000/api/video/convert",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ videoUrl }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Download failed");
      }

      setFileName(data.fileName);
      setSuccess(true);
      setVideoUrl("");

      // STEP 2 → AUTO DOWNLOAD FROM SERVER
      const downloadUrl = `http://localhost:3000/api/video/download/${data.fileName}`;

      const link = document.createElement("a");
      link.href = downloadUrl;
      link.setAttribute("download", data.fileName);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      setError(err.message || "Server error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className={`min-h-screen transition-colors duration-300 overflow-x-hidden ${
        darkMode
          ? "bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900"
          : "bg-gradient-to-br from-purple-50 via-white to-blue-50"
      }`}
      style={{
        scrollbarWidth: "none",
        msOverflowStyle: "none",
      }}
    >
      <style jsx>{`
        div::-webkit-scrollbar {
          display: none;
        }
        * {
          scrollbar-width: none;
          -ms-overflow-style: none;
        }
        *::-webkit-scrollbar {
          display: none;
        }
      `}</style>

      {/* Header */}
      <header
        className={`w-full backdrop-blur-sm shadow-sm sticky top-0 z-50 transition-colors duration-300 ${
          darkMode ? "bg-gray-800/90" : "bg-white/80"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-purple-600 to-blue-600 rounded-xl flex items-center justify-center shadow-lg transform hover:scale-105 transition-transform">
                <Video className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                  Streamforge
                </h1>
                <p
                  className={`text-xs sm:text-sm hidden sm:block ${
                    darkMode ? "text-gray-400" : "text-gray-500"
                  }`}
                >
                  Fast & Easy Downloads
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setDarkMode(!darkMode)}
                className={`p-2 rounded-lg transition-all ${
                  darkMode
                    ? "bg-gray-700 hover:bg-gray-600"
                    : "bg-gray-100 hover:bg-gray-200"
                }`}
                aria-label="Toggle theme"
              >
                {darkMode ? (
                  <Sun className="w-5 h-5 sm:w-6 sm:h-6 text-yellow-400" />
                ) : (
                  <Moon className="w-5 h-5 sm:w-6 sm:h-6 text-gray-600" />
                )}
              </button>

              <a
                href="https://github.com/rohitpokhariya10"
                target="_blank"
                rel="noopener noreferrer"
                className={`p-2 rounded-lg transition-colors ${
                  darkMode
                    ? "hover:bg-gray-700"
                    : "hover:bg-gray-100"
                }`}
              >
                <Github
                  className={`w-5 h-5 sm:w-6 sm:h-6 ${
                    darkMode ? "text-gray-300" : "text-gray-600"
                  }`}
                />
              </a>
            </div>
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16">
        {/* Hero */}
        <div className="text-center mb-8 sm:mb-12">
          <div
            className={`inline-flex items-center gap-2 px-3 sm:px-4 py-2 rounded-full text-xs sm:text-sm font-medium mb-6 transition-colors ${
              darkMode
                ? "bg-purple-900/50 text-purple-300"
                : "bg-purple-100 text-purple-700"
            }`}
          >
            <Download className="w-4 h-4" />
            High Quality Downloads
          </div>

          <h2
            className={`text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 transition-colors ${
              darkMode ? "text-white" : "text-gray-900"
            }`}
          >
            Download Videos with
            <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              {" "}
              Ease
            </span>
          </h2>

          <p
            className={`text-base sm:text-lg max-w-2xl mx-auto transition-colors ${
              darkMode ? "text-gray-300" : "text-gray-600"
            }`}
          >
            Convert and download your favorite videos in MP4 format with best
            quality
          </p>
        </div>

        {/* Converter Card */}
        <div
          className={`rounded-3xl shadow-2xl p-6 sm:p-8 lg:p-10 transition-colors duration-300 ${
            darkMode
              ? "bg-gray-800 border border-gray-700"
              : "bg-white"
          }`}
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label
                className={`block text-sm font-medium mb-2 transition-colors ${
                  darkMode ? "text-gray-200" : "text-gray-700"
                }`}
              >
                Video URL
              </label>

              <div className="relative group">
                <input
                  value={videoUrl}
                  onChange={(e) => setVideoUrl(e.target.value)}
                  placeholder="Paste your video URL here..."
                  className={`w-full px-5 py-4 pr-12 border-2 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none transition-all ${
                    darkMode
                      ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:bg-gray-650"
                      : "bg-white border-gray-200 text-gray-900 placeholder-gray-400"
                  }`}
                  disabled={loading}
                />
                <ExternalLink
                  className={`absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 transition-colors ${
                    darkMode ? "text-gray-500" : "text-gray-400"
                  }`}
                />
              </div>
            </div>

            <button
              disabled={loading || !videoUrl.trim()}
              className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-4 rounded-xl font-semibold hover:shadow-xl hover:scale-[1.02] disabled:opacity-50 disabled:hover:scale-100 flex items-center justify-center gap-3 transition-all"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Converting...
                </>
              ) : (
                <>
                  <Download className="w-5 h-5" />
                  Download
                </>
              )}
            </button>
          </form>

          {/* Success */}
          {success && (
            <div
              className={`mt-6 p-4 rounded-xl flex gap-3 animate-fadeIn ${
                darkMode
                  ? "bg-green-900/30 border border-green-700"
                  : "bg-green-50 border border-green-200"
              }`}
            >
              <CheckCircle
                className={`w-6 h-6 flex-shrink-0 ${
                  darkMode ? "text-green-400" : "text-green-600"
                }`}
              />
              <div>
                <p
                  className={`font-semibold ${
                    darkMode ? "text-green-300" : "text-green-900"
                  }`}
                >
                  Download Complete!
                </p>
                <p
                  className={`text-sm mt-1 ${
                    darkMode ? "text-green-400" : "text-green-700"
                  }`}
                >
                  File: <span className="font-mono">{fileName}</span>
                </p>
                <p
                  className={`text-xs mt-1 ${
                    darkMode ? "text-green-500" : "text-green-600"
                  }`}
                >
                  Thanks for visiting
                </p>
              </div>
            </div>
          )}

          {/* Error */}
          {error && (
            <div
              className={`mt-6 p-4 rounded-xl flex gap-3 animate-fadeIn ${
                darkMode
                  ? "bg-red-900/30 border border-red-700"
                  : "bg-red-50 border border-red-200"
              }`}
            >
              <AlertCircle
                className={`w-6 h-6 flex-shrink-0 ${
                  darkMode ? "text-red-400" : "text-red-600"
                }`}
              />
              <div>
                <p
                  className={`font-semibold ${
                    darkMode ? "text-red-300" : "text-red-900"
                  }`}
                >
                  Error
                </p>
                <p
                  className={`text-sm mt-1 ${
                    darkMode ? "text-red-400" : "text-red-700"
                  }`}
                >
                  {error}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Features */}
        <div className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-6">
          {[
            { icon: Download, text: "Fast Downloads" },
            { icon: Video, text: "High Quality" },
            { icon: CheckCircle, text: "Easy to Use" },
          ].map(({ icon: Icon, text }, i) => (
            <div
              key={i}
              className={`p-4 rounded-xl text-center transition-all hover:scale-105 ${
                darkMode
                  ? "bg-gray-800/50 border border-gray-700"
                  : "bg-white/50 border border-gray-200"
              }`}
            >
              <Icon
                className={`w-8 h-8 mx-auto mb-2 ${
                  darkMode ? "text-purple-400" : "text-purple-600"
                }`}
              />
              <p
                className={`font-medium ${
                  darkMode ? "text-gray-200" : "text-gray-700"
                }`}
              >
                {text}
              </p>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}