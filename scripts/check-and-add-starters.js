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

const NEW_STARTERS = [
  { name: "Veg Kathi Roll", price: 200 },
  { name: "Paneer Pakoda", price: 250 },
  { name: "Crispy Baby Corn", price: 250 },
  { name: "Paneer Kathi Roll", price: 170 },
  { name: "Veg Spring Roll", price: 180 },
  { name: "Cheese Corn Tikki", price: 225 },
  { name: "Paneer Finger", price: 250 },
  { name: "Soya Chilli", price: 220 },
  { name: "Mushroom Salt and Pepper", price: 250 },
  { name: "Dahi Ke Kabab", price: 250 },
  { name: "American Corn Salt and Pepper", price: 220 },
  { name: "Dahi Ke Sholay", price: 180 },
  { name: "Veg Cutlet", price: 180 },
  { name: "Veg Pakoda", price: 180 },
  { name: "Cheese Kurkure", price: 250 },
  { name: "Paneer Kurkure", price: 250 },
  { name: "Paneer & Cheese Cigar Roll", price: 275 },
  { name: "Veg Burger", price: 100 },
  { name: "Gobhi Manchurian (Dry/Gravy)", price: 150 }
];

console.log("=== CHECKING EXISTING ITEMS FOR DUPLICATES ===");

const existingNameMap = new Map();
MENU_ITEMS.forEach((item) => {
  existingNameMap.set(item.name.toLowerCase().trim(), item);
});

// Find max numerical ID across all items to generate new safe IDs
let maxIdNum = 260; // start after last known id nonveg-260
MENU_ITEMS.forEach((item) => {
  const match = item.id.match(/-(\d+)$/);
  if (match) {
    const num = parseInt(match[1], 10);
    if (num > maxIdNum) maxIdNum = num;
  }
});

console.log(`Current highest item ID number: ${maxIdNum}\n`);

const addedItems = [];
const updatedItems = [];

NEW_STARTERS.forEach((newDish) => {
  const normName = newDish.name.toLowerCase().trim();
  if (existingNameMap.has(normName)) {
    const existing = existingNameMap.get(normName);
    if (existing.price !== newDish.price) {
      console.log(`[EXISTING UPDATE] "${existing.name}" (ID: ${existing.id}): updating price from ₹${existing.price} to ₹${newDish.price}`);
      existing.price = newDish.price;
      updatedItems.push(existing);
    } else {
      console.log(`[EXISTING MATCH] "${existing.name}" (ID: ${existing.id}): price matches ₹${existing.price}. No change.`);
    }
  } else {
    maxIdNum++;
    const newId = `starter-${maxIdNum}`;
    const slug = newDish.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");
    
    // Determine category: "Starter (Chinese)"
    const category = "Starter (Chinese)";
    const imagePath = `/assets/food/starter-chinese/${newDish.name}.png`;

    const newItem = {
      id: newId,
      name: newDish.name,
      slug: slug,
      category: category,
      price: newDish.price,
      type: "veg",
      available: true,
      featured: false,
      description: `Delicious freshly prepared ${newDish.name} served hot with signature green mint and garlic dips.`,
      image: imagePath,
      preparationTime: "15m"
    };

    MENU_ITEMS.push(newItem);
    addedItems.push(newItem);
    console.log(`[NEW ITEM ADDED] "${newItem.name}" -> ID: ${newItem.id}, Price: ₹${newItem.price}, Slug: ${newItem.slug}`);
  }
});

console.log(`\nNewly Added Items Count: ${addedItems.length}`);
console.log(`Updated Existing Items Count: ${updatedItems.length}`);
