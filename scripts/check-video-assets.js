const fs = require("fs");
const path = require("path");

const PUBLIC_DIR = path.join(__dirname, "../public");

const VIDEOS_TO_CHECK = [
  "/videos/splash.mp4",
  "/videos/intro.mp4",
  "/videos/hero.mov",
  "/assets/restaurant/WhatsApp Video 2026-07-11 at 11.26.30.mp4",
  "/assets/banquet/WhatsApp Video 2026-07-11 at 07.27.27.mp4",
  "/assets/outside view/WhatsApp Video 2026-07-11 at 11.26.30-2.mp4",
  "/assets/outside view/WhatsApp Video 2026-07-11 at 11.26.32-2.mp4",
  "/assets/outside view/WhatsApp Video 2026-07-11 at 11.26.32-3.mp4",
  "/assets/outside gallery/WhatsApp Video 2026-07-11 at 11.26.32.mp4",
  "/assets/rooms/WhatsApp Video 2026-07-11 at 11.30.22.mp4",
  "/assets/rooms/WhatsApp Video 2026-07-11 at 11.30.24-2.mp4",
  "/assets/rooms/WhatsApp Video 2026-07-11 at 11.30.26.mp4",
  "/assets/rooms/WhatsApp Video 2026-07-11 at 11.30.28.mp4",
  "/assets/rooms/WhatsApp Video 2026-07-11 at 11.30.29.mp4",
  "/assets/rooms/WhatsApp Video 2026-07-11 at 11.30.30.mp4",
  "/assets/rooms/WhatsApp Video 2026-07-11 at 11.30.31.mp4",
  "/assets/restaurant/WhatsApp Video 2026-07-10 at 21.12.22-4.mp4",
  "/assets/restaurant/WhatsApp Video 2026-07-10 at 21.12.22-6.mp4",
  "/assets/restaurant/WhatsApp Video 2026-07-10 at 21.12.22-7.mp4",
  "/assets/restaurant/WhatsApp Video 2026-07-10 at 21.12.22-8.mp4",
  "/assets/banquet/WhatsApp Video 2026-07-11 at 07.27.28.mp4",
  "/assets/banquet/WhatsApp Video 2026-07-10 at 21.12.22.mp4",
  "/assets/banquet/WhatsApp Video 2026-07-10 at 21.12.22-2.mp4",
  "/assets/banquet/WhatsApp Video 2026-07-10 at 21.12.17-3.mp4",
  "/assets/banquet/WhatsApp Video 2026-07-10 at 21.12.17-5.mp4",
  "/assets/kitchen/WhatsApp Video 2026-07-10 at 21.12.22-3.mp4"
];

console.log("=== CHECKING VIDEO ASSET FILES ON DISK ===");
VIDEOS_TO_CHECK.forEach((relPath) => {
  const fullPath = path.join(PUBLIC_DIR, relPath);
  const exists = fs.existsSync(fullPath);
  console.log(`${exists ? "YES ✅" : "NO ❌ "} : ${relPath}`);
});
