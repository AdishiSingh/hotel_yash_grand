const fs = require("fs");
const path = require("path");

const PUBLIC_DIR = path.join(__dirname, "../public");
const ASSETS_DIR = path.join(PUBLIC_DIR, "assets");
const OUTPUT_FILE = path.join(__dirname, "../src/data/gallery.ts");

const FOLDERS_TO_SCAN = [
  { folder: "outside view", cat: "hotel" },
  { folder: "outside gallery", cat: "hotel" },
  { folder: "gallery", cat: "hotel" },
  { folder: "rooms", cat: "rooms" },
  { folder: "restaurant", cat: "restaurant" },
  { folder: "banquet", cat: "banquet" },
  { folder: "food", cat: "food" }
];

function scanGallery() {
  console.log("Scanning gallery assets directory...");
  
  if (!fs.existsSync(ASSETS_DIR)) {
    console.error("Assets directory not found!");
    return;
  }

  const items = [];
  let idCounter = 1;

  FOLDERS_TO_SCAN.forEach(({ folder, cat }) => {
    const dirPath = path.join(ASSETS_DIR, folder);
    if (!fs.existsSync(dirPath)) return;

    const files = fs.readdirSync(dirPath);
    files.forEach((file) => {
      // Ignore system files
      if (file.startsWith(".") || file.startsWith("desktop.ini")) return;

      const filePath = path.join(dirPath, file);
      const stat = fs.statSync(filePath);
      if (stat.isDirectory()) return;

      const ext = path.extname(file).toLowerCase();
      const relativePath = `/assets/${folder}/${file}`;
      
      const isVideo = ext === ".mp4" || ext === ".webm" || ext === ".ogg";
      const isImage = ext === ".png" || ext === ".jpg" || ext === ".jpeg" || ext === ".webp";

      if (!isImage && !isVideo) return;

      // Make a clean title
      let title = path.basename(file, ext);
      // Clean up common WhatsApp/date formats
      title = title
        .replace(/WhatsApp Image \d{4}-\d{2}-\d{2} at \d{2}\.\d{2}\.\d{2}/gi, "Hotel Detail")
        .replace(/WhatsApp Video \d{4}-\d{2}-\d{2} at \d{2}\.\d{2}\.\d{2}/gi, "Hotel Panning Video")
        .replace(/[^a-zA-Z0-9\s()]/g, " ")
        .replace(/\s+/g, " ")
        .trim();

      if (!title || title === "Hotel Detail" || title === "Hotel Panning Video") {
        title = `${cat.charAt(0).toUpperCase() + cat.slice(1)} Showcase #${idCounter}`;
      }

      // Feature highlights mapping
      const isFeatured = 
        title.toLowerCase().includes("facade") || 
        title.toLowerCase().includes("royal") || 
        title.toLowerCase().includes("interior") || 
        title.toLowerCase().includes("stage") || 
        title.toLowerCase().includes("suite") || 
        title.toLowerCase().includes("seating") || 
        idCounter < 6;

      items.push({
        id: `gallery-${idCounter++}`,
        title: title,
        category: isVideo ? "videos" : cat,
        mediaType: isVideo ? "video" : "image",
        image: isVideo ? "" : relativePath,
        thumbnail: isVideo ? "" : relativePath,
        video: isVideo ? relativePath : undefined,
        featured: isFeatured,
        alt: `${title} at Hotel Yash Grand Varanasi`
      });
    });
  });

  const output = `export interface GalleryItem {
  id: string;
  title: string;
  category: "hotel" | "rooms" | "restaurant" | "banquet" | "food" | "videos";
  mediaType: "image" | "video";
  image: string;
  thumbnail: string;
  video?: string;
  featured: boolean;
  alt: string;
}

export const GALLERY_ITEMS: GalleryItem[] = ${JSON.stringify(items, null, 2)};
`;

  fs.writeFileSync(OUTPUT_FILE, output, "utf8");
  console.log(`Successfully generated gallery dataset with ${items.length} unique items.`);
}

scanGallery();
