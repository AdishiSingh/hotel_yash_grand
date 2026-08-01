const fs = require("fs");
const path = require("path");

const MENU_FILE = path.join(__dirname, "../src/data/menu.ts");

function cleanMenu() {
  console.log("Cleaning up duplicate menu items...");

  if (!fs.existsSync(MENU_FILE)) {
    console.error(`Menu file not found at: ${MENU_FILE}`);
    return;
  }

  const content = fs.readFileSync(MENU_FILE, "utf8");

  // 1. Convert TypeScript file to valid JavaScript to evaluate arrays
  const jsContent = content
    .replace(/export interface [\s\S]*?\n}/g, "") // Remove interfaces
    .replace(/: MenuCategory\[]/g, "")           // Remove type tag 1
    .replace(/: MenuItem\[]/g, "")              // Remove type tag 2
    .replace(/\bexport\s+/g, "");                // Remove export keywords

  // 2. Evaluate the code in a local sandbox to extract variables
  let MENU_CATEGORIES = [];
  let MENU_ITEMS = [];

  try {
    const sandbox = {};
    const evalFn = new Function("exports", jsContent + "\nreturn { MENU_CATEGORIES, MENU_ITEMS };");
    const result = evalFn(sandbox);
    MENU_CATEGORIES = result.MENU_CATEGORIES;
    MENU_ITEMS = result.MENU_ITEMS;
  } catch (err) {
    console.error("Error evaluating menu file:", err);
    return;
  }

  console.log(`Original menu items count: ${MENU_ITEMS.length}`);

  // 3. Filter out duplicates based on exact name (keeping only the first instance)
  const seenNames = new Set();
  const cleanItems = [];
  const duplicates = [];

  MENU_ITEMS.forEach((item) => {
    const normalizedName = item.name.trim().toLowerCase();
    if (!seenNames.has(normalizedName)) {
      seenNames.add(normalizedName);
      cleanItems.push(item);
    } else {
      duplicates.push(item);
    }
  });

  console.log(`Found and removed ${duplicates.length} duplicate items:`);
  duplicates.forEach((d) => console.log(`- [${d.category}] ${d.name} (${d.id})`));

  console.log(`Cleaned menu items count: ${cleanItems.length}`);

  // 4. Group items by category to format with comments
  const categoryGroups = {};
  MENU_CATEGORIES.forEach((cat) => {
    categoryGroups[cat.label] = [];
  });
  
  // Custom mapping for cases where category names might differ slightly
  cleanItems.forEach((item) => {
    if (!categoryGroups[item.category]) {
      categoryGroups[item.category] = [];
    }
    categoryGroups[item.category].push(item);
  });

  // 5. Reconstruct typescript code
  let output = `export interface MenuItem {
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

export const MENU_CATEGORIES: MenuCategory[] = ${JSON.stringify(MENU_CATEGORIES, null, 2)};

export const MENU_ITEMS: MenuItem[] = [`;

  // Output items grouped by category with comments
  Object.keys(categoryGroups).forEach((categoryName) => {
    const items = categoryGroups[categoryName];
    if (items.length === 0) return;

    output += `\n\n  // ${categoryName.toUpperCase()}`;
    items.forEach((item) => {
      // Custom clean layout generation for each object
      output += `\n  {\n`;
      output += `    id: ${JSON.stringify(item.id)},\n`;
      output += `    name: ${JSON.stringify(item.name)},\n`;
      output += `    slug: ${JSON.stringify(item.slug)},\n`;
      output += `    category: ${JSON.stringify(item.category)},\n`;
      if (item.subCategory) {
        output += `    subCategory: ${JSON.stringify(item.subCategory)},\n`;
      }
      output += `    price: ${item.price},\n`;
      output += `    type: ${JSON.stringify(item.type)},\n`;
      output += `    available: ${item.available},\n`;
      output += `    featured: ${item.featured},\n`;
      if (item.spicyLevel !== undefined) {
        output += `    spicyLevel: ${item.spicyLevel},\n`;
      }
      if (item.description) {
        output += `    description: ${JSON.stringify(item.description)},\n`;
      }
      if (item.image) {
        output += `    image: ${JSON.stringify(item.image)},\n`;
      }
      if (item.preparationTime) {
        output += `    preparationTime: ${JSON.stringify(item.preparationTime)},\n`;
      }
      if (item.displayPrice) {
        output += `    displayPrice: ${JSON.stringify(item.displayPrice)},\n`;
      }
      if (item.variants) {
        output += `    variants: ${JSON.stringify(item.variants, null, 6).replace(/\n/g, "\n    ")},\n`;
      }
      output += `  },`;
    });
  });

  output += `\n];\n`;

  fs.writeFileSync(MENU_FILE, output, "utf8");
  console.log("Successfully wrote cleaned menu.ts file.");
}

cleanMenu();
