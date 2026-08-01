const fs = require("fs");
const path = require("path");

const MENU_FILE_PATH = path.join(__dirname, "../src/data/menu.ts");

const content = fs.readFileSync(MENU_FILE_PATH, "utf8");

// Parse items to update in place
const jsContent = content
  .replace(/export interface [\s\S]*?\n}/g, "")
  .replace(/: MenuCategory\[]/g, "")
  .replace(/: MenuItem\[]/g, "")
  .replace(/\bexport\s+/g, "");

let MENU_ITEMS = [];
const evalFn = new Function("exports", jsContent + "\nreturn { MENU_ITEMS };");
MENU_ITEMS = evalFn({}).MENU_ITEMS;

const SANDWICH_DESCRIPTIONS = {
  "sandwich-191": "Fresh garden cucumber, tomato, and bell pepper slices layered with green mint chutney between grilled bread slices.",
  "sandwich-192": "Golden-toasted double layer sandwich stuffed with rich melted processed cheddar and mozzarella cheese.",
  "sandwich-193": "Hearty grilled sandwich stuffed with seasoned cottage cheese cubes, chopped bell peppers, and special herbs.",
  "sandwich-194": "Triple-decker toasted club sandwich filled with crisp lettuce, sliced tomatoes, spiced paneer, and cheese.",
  "sandwich-195": "Spicy toasted sandwich loaded with melted cheese, chopped green chillies, and cracked black pepper.",
  "sandwich-196": "Crisp toasted sandwich filled with sweet corn kernels, rich creamy mayo, and melted cheese."
};

const SOUTH_INDIAN_DESCRIPTIONS = {
  "south-98": "Golden crispy thin crepe made from fermented rice and urad dal batter, served with coconut chutney and hot sambar.",
  "south-99": "Crispy thin rice crepe stuffed with seasoned, tempered mashed potatoes and onions, served with chutneys and sambar.",
  "south-100": "Crispy golden rice crepe filled with spiced grated paneer, fresh coriander, and onions.",
  "south-101": "Crispy masala dosa cooked generously with fresh white butter for an authentic South Indian flavor.",
  "south-102": "Crispy, lacy crepe prepared from semolina, rice flour, cumin, and green chillies.",
  "south-103": "Lacy semolina crepe stuffed with seasoned potato-onion masala, roasted cashews, and spices.",
  "south-104": "Thick, soft savory rice pancake griddle-cooked till golden, served with spicy sambar and chutneys.",
  "south-105": "Thick savory rice pancake topped with caramelized chopped onions, curry leaves, and green chillies.",
  "south-106": "Thick rice pancake loaded with a colorful topping of finely diced tomatoes, onions, capsicum, and herbs.",
  "south-107": "Two soft, fluffy steamed rice-and-lentil cakes served with piping hot vegetable sambar and coconut chutney.",
  "south-108": "Two golden crisp deep-fried savory lentil donuts served submerged in hot spiced sambar and coconut chutney."
};

let southUpdated = 0;
let sandwichUpdated = 0;

MENU_ITEMS.forEach((item) => {
  if (item.category === "Sandwiches") {
    if (SANDWICH_DESCRIPTIONS[item.id]) {
      item.description = SANDWICH_DESCRIPTIONS[item.id];
    }
    sandwichUpdated++;
  } else if (item.category === "South Indian") {
    if (SOUTH_INDIAN_DESCRIPTIONS[item.id]) {
      item.description = SOUTH_INDIAN_DESCRIPTIONS[item.id];
    }
    southUpdated++;
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
  console.log(`Successfully updated ${southUpdated} South Indian items and ${sandwichUpdated} Sandwich items in menu.ts!`);
} else {
  console.error("Could not locate MENU_ITEMS array start in menu.ts");
}
