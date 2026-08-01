const fs = require("fs");
const path = require("path");

const MENU_FILE_PATH = path.join(__dirname, "../src/data/menu.ts");
const PUBLIC_DIR = path.join(__dirname, "../public");
const PUBLIC_FOOD_DIR = path.join(PUBLIC_DIR, "assets/food");

function getAllFiles(dir, fileList = []) {
  if (!fs.existsSync(dir)) return fileList;
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      getAllFiles(fullPath, fileList);
    } else {
      if (file !== ".DS_Store") {
        fileList.push(fullPath);
      }
    }
  }
  return fileList;
}

const content = fs.readFileSync(MENU_FILE_PATH, "utf8");
const jsContent = content
  .replace(/export interface [\s\S]*?\n}/g, "")
  .replace(/: MenuCategory\[]/g, "")
  .replace(/: MenuItem\[]/g, "")
  .replace(/\bexport\s+/g, "");

let MENU_ITEMS = [];
const evalFn = new Function("exports", jsContent + "\nreturn { MENU_ITEMS };");
MENU_ITEMS = evalFn({}).MENU_ITEMS;

const diskFiles = getAllFiles(PUBLIC_FOOD_DIR);
const diskRelPaths = diskFiles.map((f) => "/" + path.relative(PUBLIC_DIR, f));

const referencedPaths = new Set(MENU_ITEMS.map((i) => i.image).filter(Boolean));

console.log("=== UNREFERENCED DISK FILES ===");
const unreferenced = diskRelPaths.filter((p) => !referencedPaths.has(p));
unreferenced.forEach((p) => console.log("-", p));

console.log("\n=== BROKEN MENU ITEM IMAGE PATHS ===");
MENU_ITEMS.forEach((item) => {
  if (item.image && !fs.existsSync(path.join(PUBLIC_DIR, item.image))) {
    console.log(`- [${item.id}] "${item.name}": expected '${item.image}' (File NOT found)`);
  }
});

console.log("\nTotal Disk Food Images:", diskRelPaths.length);
console.log("Referenced in menu.ts:", referencedPaths.size);
console.log("Unreferenced Disk Images:", unreferenced.length);
