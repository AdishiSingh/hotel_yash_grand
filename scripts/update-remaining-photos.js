const fs = require("fs");
const path = require("path");

const MENU_FILE_PATH = path.join(__dirname, "../src/data/menu.ts");

const content = fs.readFileSync(MENU_FILE_PATH, "utf8");

const jsContent = content
  .replace(/export interface [\s\S]*?\n}/g, "")
  .replace(/: MenuCategory\[]/g, "")
  .replace(/: MenuItem\[]/g, "")
  .replace(/\bexport\s+/g, "");

let MENU_ITEMS = [];
const evalFn = new Function("exports", jsContent + "\nreturn { MENU_ITEMS };");
MENU_ITEMS = evalFn({}).MENU_ITEMS;

const PHOTO_MAPPINGS = {
  "soup-1": "/assets/food/main-course/Paneer Butter Masala.png",
  "soup-2": "/assets/food/main-course/Handi Mushroom.png",
  "soup-3": "/assets/food/main-course/Mix Veg.png",
  "soup-4": "/assets/food/starter-chinese/Crispy Corn.png",
  "soup-5": "/assets/food/rice-noodles/Veg Noodles.png",
  "soup-6": "/assets/food/starter-chinese/Paneer Chilli (Dry-Gravy).png",
  "soup-7": "/assets/food/salad-papad/Green Salad.png",
  "rice-223": "/assets/food/rice-biryani/Veg Biryani.png"
};

let count = 0;
MENU_ITEMS.forEach((item) => {
  if (PHOTO_MAPPINGS[item.id]) {
    item.image = PHOTO_MAPPINGS[item.id];
    count++;
  }
});

const startMarker = "export const MENU_ITEMS: MenuItem[] = [";
const startIndex = content.indexOf(startMarker);

if (startIndex !== -1) {
  const newContent = content.substring(0, startIndex + startMarker.length) + "\n" + 
    JSON.stringify(MENU_ITEMS, null, 2)
      .substring(1, JSON.stringify(MENU_ITEMS, null, 2).length - 1)
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
      .replace(/"variants":/g, "variants:") + "\n];\n";

  fs.writeFileSync(MENU_FILE_PATH, newContent, "utf8");
  console.log(`Successfully assigned photo paths for ${count} remaining dishes in menu.ts!`);
}
