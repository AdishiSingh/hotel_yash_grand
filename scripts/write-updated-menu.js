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

const NEW_STARTERS_MAP = {
  "starter-261": "/assets/food/starter-chinese/Veg Spring Roll.png",
  "starter-262": "/assets/food/starter-chinese/Paneer 65.png",
  "starter-263": "/assets/food/starter-chinese/Crispy Corn.png",
  "starter-264": "/assets/food/starter-chinese/Veg Spring Roll.png",
  "starter-265": "/assets/food/starter-chinese/Crispy Corn.png",
  "starter-266": "/assets/food/starter-chinese/French Fries.png",
  "starter-267": "/assets/food/starter-chinese/Potato Chilli.png",
  "starter-268": "/assets/food/starter-chinese/Mushroom 65.png",
  "starter-269": "/assets/food/starter-chinese/Crispy Corn.png",
  "starter-270": "/assets/food/starter-chinese/Crispy Corn.png",
  "starter-271": "/assets/food/starter-chinese/Veg Spring Roll.png",
  "starter-272": "/assets/food/starter-chinese/Crispy Corn.png",
  "starter-273": "/assets/food/starter-chinese/Crispy Corn.png",
  "starter-274": "/assets/food/starter-chinese/Crispy Corn.png",
  "starter-275": "/assets/food/starter-chinese/Paneer 65.png",
  "starter-276": "/assets/food/starter-chinese/Veg Spring Roll.png",
  "starter-277": "/assets/food/starter-chinese/French Fries.png",
  "starter-278": "/assets/food/starter-chinese/Veg Manchurian (Dry-Gravy).png"
};

MENU_ITEMS.forEach((item) => {
  if (NEW_STARTERS_MAP[item.id]) {
    item.image = NEW_STARTERS_MAP[item.id];
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
  console.log(`Successfully mapped images for newly added starters in menu.ts!`);
}
