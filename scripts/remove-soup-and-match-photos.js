const fs = require("fs");
const path = require("path");

const MENU_FILE_PATH = path.join(__dirname, "../src/data/menu.ts");
const PUBLIC_DIR = path.join(__dirname, "../public");
const PUBLIC_FOOD_DIR = path.join(PUBLIC_DIR, "assets/food");

const content = fs.readFileSync(MENU_FILE_PATH, "utf8");

// Extract MENU_CATEGORIES and MENU_ITEMS
const jsContent = content
  .replace(/export interface [\s\S]*?\n}/g, "")
  .replace(/: MenuCategory\[]/g, "")
  .replace(/: MenuItem\[]/g, "")
  .replace(/\bexport\s+/g, "");

let MENU_CATEGORIES = [];
let MENU_ITEMS = [];

try {
  const evalFn = new Function("exports", jsContent + "\nreturn { MENU_CATEGORIES, MENU_ITEMS };");
  const result = evalFn({});
  MENU_CATEGORIES = result.MENU_CATEGORIES;
  MENU_ITEMS = result.MENU_ITEMS;
} catch (err) {
  console.error("Error evaluating menu.ts:", err);
  process.exit(1);
}

console.log(`Original Menu Categories Count: ${MENU_CATEGORIES.length}`);
console.log(`Original Menu Items Count     : ${MENU_ITEMS.length}`);

// 1. Remove Soup category and Soup items
const updatedCategories = MENU_CATEGORIES.filter(cat => cat.id !== "soup");
const updatedItems = MENU_ITEMS.filter(item => item.category.toLowerCase() !== "soup" && !item.id.startsWith("soup-"));

console.log(`Updated Menu Categories Count : ${updatedCategories.length}`);
console.log(`Updated Menu Items Count      : ${updatedItems.length}`);

// 2. Collect all files in public/assets/food/
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

const diskFiles = getAllFiles(PUBLIC_FOOD_DIR);
const diskRelPaths = diskFiles.map(f => "/" + path.relative(PUBLIC_DIR, f));

// Map of lower-case basename -> exact relative path
const diskBasenameMap = new Map();
diskRelPaths.forEach(relPath => {
  const base = path.basename(relPath).toLowerCase();
  diskBasenameMap.set(base, relPath);
});

// Match each dish with its exact photo file on disk if available
let matchedExact = 0;
updatedItems.forEach(item => {
  if (item.image) {
    const exactPath = path.join(PUBLIC_DIR, item.image);
    if (fs.existsSync(exactPath)) {
      matchedExact++;
    } else {
      const base = path.basename(item.image).toLowerCase();
      if (diskBasenameMap.has(base)) {
        item.image = diskBasenameMap.get(base);
        matchedExact++;
      }
    }
  }
});

console.log(`Exact Matched Image Dishes   : ${matchedExact} / ${updatedItems.length}`);

// Re-write menu.ts cleanly
const categoryStr = JSON.stringify(updatedCategories, null, 2)
  .replace(/"id":/g, "id:")
  .replace(/"label":/g, "label:")
  .replace(/"icon":/g, "icon:");

const itemsStr = JSON.stringify(updatedItems, null, 2)
  .replace(/"id":/g, "id:")
  .replace(/"name":/g, "name:")
  .replace(/"slug":/g, "slug:")
  .replace(/"category":/g, "category:")
  .replace(/"subCategory":/g, "subCategory:")
  .replace(/"price":/g, "price:")
  .replace(/"type":/g, "type:")
  .replace(/"available":/g, "available:")
  .replace(/"featured":/g, "featured:")
  .replace(/"spicyLevel":/g, "spicyLevel:")
  .replace(/"description":/g, "description:")
  .replace(/"image":/g, "image:")
  .replace(/"preparationTime":/g, "preparationTime:")
  .replace(/"displayPrice":/g, "displayPrice:")
  .replace(/"variants":/g, "variants:");

const newFileContent = `export interface MenuItem {
  id: string;
  name: string;
  slug: string;
  category: string;
  subCategory?: string;
  price: number;
  type: "veg" | "non-veg";
  available: boolean;
  featured: boolean;
  spicyLevel?: 0 | 1 | 2 | 3;
  description?: string;
  image?: string;
  preparationTime?: string;
  displayPrice?: string;
  variants?: { label: string; price: number }[];
}

export interface MenuCategory {
  id: string;
  label: string;
  icon: string;
}

export const MENU_CATEGORIES: MenuCategory[] = ${categoryStr};

export const MENU_ITEMS: MenuItem[] = ${itemsStr};
`;

fs.writeFileSync(MENU_FILE_PATH, newFileContent, "utf8");
console.log("Successfully updated menu.ts with soup removed and dish photos matched!");
