const fs = require("fs");
const path = require("path");

const MENU_FILE_PATH = path.join(__dirname, "../src/data/menu.ts");

let content = fs.readFileSync(MENU_FILE_PATH, "utf8");

// Map of fallback image assignments for beverages without distinct images
const BEVERAGE_IMAGE_MAP = {
  "bev-113": "/assets/food/beverages/Lassi (Sweet & Salt).png", // Salted Lassi
  "bev-114": "/assets/food/beverages/Lassi (Sweet & Salt).png", // Butter Milk
  "bev-121": "/assets/food/beverages/Black Tea.png", // Tea
  "bev-123": "/assets/food/beverages/Black Tea.png", // Green Tea
  "bev-124": "/assets/food/beverages/Coffee.png", // Hot Coffee
  "bev-170": "/assets/food/beverages/Fruit Punch.png", // Canned Juice
  "bev-171": "/assets/food/beverages/Cold Drink.png", // Canned Soft Drink
  "bev-172": "/assets/food/beverages/Fresh Lime.png", // Fresh Lime Soda (Sweet & Salt)
  "bev-178": "/assets/food/beverages/Milk Shake(Vanilla).png", // Strawberry / Chocolate / Vanilla / Mango / Banana Milk Shake
  "bev-180": "/assets/food/beverages/Black Tea.png", // Masala Tea
  "bev-190": "/assets/food/beverages/Blue Lagoon.png" // Virgin Mojito
};

// Rich descriptions for beverages lacking descriptions
const BEVERAGE_DESCRIPTIONS = {
  "bev-109": "Packaged premium mineral drinking water, served chilled or at room temperature.",
  "bev-110": "Chilled 300ml canned or bottled carbonated soft drinks of your choice.",
  "bev-111": "Invigorating fresh lime soda prepared with natural lemon juice and sparkling water.",
  "bev-112": "Traditional whipped yogurt lassi infused with aromatic green cardamom and saffron syrup.",
  "bev-113": "Chilled salted yogurt cooler spiked with roasted cumin seeds and Himalayan black salt.",
  "bev-114": "Light, healthy spiced buttermilk infused with fresh coriander and green chillies.",
  "bev-115": "Creamy blend of whole milk and Madagascan vanilla ice cream.",
  "bev-116": "Rich blend of dark cocoa, whole milk, and chocolate ice cream.",
  "bev-117": "Luscious strawberry milk shake crafted with fresh berry puree and ice cream.",
  "bev-118": "Decadent butterscotch shake loaded with crunchy praline bits and caramel syrup.",
  "bev-119": "Whipped iced coffee blended with whole milk and dark roast espresso.",
  "bev-120": "Rich cold coffee topped with a generous scoop of artisanal vanilla ice cream.",
  "bev-121": "Traditional Indian masala chai brewed with fresh milk, ginger, and green cardamom.",
  "bev-122": "Freshly brewed hot Assam black tea served with lemon or honey.",
  "bev-123": "Antioxidant-rich organic green tea infused with subtle herbal notes.",
  "bev-124": "Freshly frothed hot instant coffee made with rich milk and cocoa dusting.",
  "bev-170": "Chilled premium canned fruit juice in seasonal fruit flavors.",
  "bev-171": "Assorted chilled canned soft drinks served over crushed ice.",
  "bev-172": "Refreshing fizzy soda infused with fresh lime juice, sea salt, and mint.",
  "bev-173": "Authentic North Indian thick yogurt lassi available in sweet or salted variations.",
  "bev-177": "Wholesome health shake blended with fresh fruits, oats, and natural honey.",
  "bev-178": "Customizable thick milk shake choice of Strawberry, Chocolate, Vanilla, Mango, or Banana.",
  "bev-180": "Fragrant Indian spiced tea brewed with whole cloves, cinnamon, and cardamoms.",
  "bev-181": "Steaming hot handcrafted milk coffee brewed to aromatic perfection.",
  "bev-182": "Hot whole milk served with your choice of saffron, turmeric, or sugar.",
  "bev-183": "Energy-boosting health drink packed with vital nutrients and crushed nuts.",
  "bev-184": "Rich chocolate hot drink prepared with Bournvita or dark hot chocolate fudge.",
  "bev-185": "Vibrant blue curaçao mocktail mixed with lemon-lime soda and crushed mint.",
  "bev-186": "Exotic orange-citrus mocktail infused with fresh fruit nectar and soda.",
  "bev-187": "Tropical mango mocktail blended with passion fruit syrup and crushed ice.",
  "bev-188": "Refreshing medley of mixed tropical fruit juices layered with sparkling soda.",
  "bev-189": "Chilled litchi nectar mocktail infused with lime juice and crushed ice.",
  "bev-190": "Classic Cuban-style non-alcoholic mojito with muddled fresh lime, mint leaves, and soda."
};

console.log("Updating beverage items in menu.ts...");

// Parse items to update in place
const jsContent = content
  .replace(/export interface [\s\S]*?\n}/g, "")
  .replace(/: MenuCategory\[]/g, "")
  .replace(/: MenuItem\[]/g, "")
  .replace(/\bexport\s+/g, "");

let MENU_ITEMS = [];
const evalFn = new Function("exports", jsContent + "\nreturn { MENU_ITEMS };");
MENU_ITEMS = evalFn({}).MENU_ITEMS;

let updatedCount = 0;

MENU_ITEMS.forEach((item) => {
  if (item.category === "Beverages") {
    // 1. Assign image if missing and mapping exists
    if (!item.image && BEVERAGE_IMAGE_MAP[item.id]) {
      item.image = BEVERAGE_IMAGE_MAP[item.id];
    }
    // 2. Assign rich description
    if (BEVERAGE_DESCRIPTIONS[item.id]) {
      item.description = BEVERAGE_DESCRIPTIONS[item.id];
    }
    // 3. Fix MRP display prices for mineral water & soft drinks
    if (item.id === "bev-109") {
      item.price = 20;
      item.displayPrice = "₹20 (MRP)";
    }
    if (item.id === "bev-110") {
      item.price = 40;
      item.displayPrice = "₹40 (MRP)";
    }
    updatedCount++;
  }
});

// Re-write menu.ts cleanly
const updatedJsArray = JSON.stringify(MENU_ITEMS, null, 2)
  .replace(/"([^"]+)":/g, "$1:") // convert quotes around keys to unquoted object keys
  .replace(/\\"/g, '"');

// Replace MENU_ITEMS definition in file
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
  console.log(`Successfully updated ${updatedCount} beverage items in menu.ts!`);
} else {
  console.error("Could not locate MENU_ITEMS array start in menu.ts");
}
