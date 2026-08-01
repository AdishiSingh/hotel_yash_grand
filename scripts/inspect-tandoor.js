const fs = require("fs");
const path = require("path");

const MENU_FILE_PATH = path.join(__dirname, "../src/data/menu.ts");
const PUBLIC_DIR = path.join(__dirname, "../public");

const content = fs.readFileSync(MENU_FILE_PATH, "utf8");
const jsContent = content
  .replace(/export interface [\s\S]*?\n}/g, "")
  .replace(/: MenuCategory\[]/g, "")
  .replace(/: MenuItem\[]/g, "")
  .replace(/\bexport\s+/g, "");

let MENU_ITEMS = [];
const evalFn = new Function("exports", jsContent + "\nreturn { MENU_ITEMS };");
MENU_ITEMS = evalFn({}).MENU_ITEMS;

const tandoorItems = MENU_ITEMS.filter(i => i.category === "Tandoor Starter");

console.log(`=== TANDOOR STARTER (${tandoorItems.length} items) ===\n`);
tandoorItems.forEach((item, idx) => {
  const hasImg = !!item.image;
  const fileExists = hasImg ? fs.existsSync(path.join(PUBLIC_DIR, item.image)) : false;
  console.log(`${idx + 1}. [${item.id}] "${item.name}"`);
  console.log(`   Price      : ₹${item.price}`);
  console.log(`   Image      : ${item.image || "(none)"}`);
  console.log(`   File Exists: ${fileExists ? "YES ✅" : "NO ❌"}`);
  console.log(`   Description: ${item.description || "(none)"}`);
  console.log("");
});
