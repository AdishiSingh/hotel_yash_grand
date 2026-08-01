const fs = require("fs");
const path = require("path");

const MENU_FILE_PATH = path.join(__dirname, "../src/data/menu.ts");
const SCRIPTS_DIR = __dirname;
const PUBLIC_FOOD_DIR = path.join(__dirname, "../public/assets/food");

const CATEGORY_SLUG_MAP = {
  "soup": "Soup",
  "salad-papad": "Salad & Papad",
  "starter-chinese": "Starter (Chinese)",
  "rice-noodles": "Rice & Noodles",
  "main-course": "Main Course",
  "dal": "Dal",
  "rice-biryani": "Rice & Biryani",
  "tandoori-bread": "Tandoori Bread",
  "tandoor-starter": "Tandoor Starter",
  "south-indian": "South Indian",
  "beverages": "Beverages",
  "momos": "Momos",
  "sandwiches": "Sandwiches",
  "pizza": "Pizza",
  "combos": "Combos",
  "sweets-desserts": "Sweets & Desserts",
  "thalis": "Thalis"
};

const OVERRIDES = {
  "mixvegkabab.png": "tandoor-97", // Veg Seekh Kabab
  "malaipaneertikka.png": "tandoor-91", // Paneer Malai Tikka
  "utpam.png": "south-104", // Plain Uttapam
  "Laccha Paratha.png": "bread-88", // Lachha Paratha
  "Onion Uttapam.png": "south-105", // Onion Uttapam
  "Margherita Pizza.png": "pizza-197", // Pizza Margherita
  "Mushroom Pizza.png": "pizza-200", // Mushroom & Cheese Pizza
  "Chicken Lolipop.png": "nonveg-243", // Chicken Lollipop
  "Veg Jhalfrezi.png": "main-48", // Veg Jalfrezi
  "Matar Mushroom.png": "main-55", // Mushroom Matar
  "Vegetable Kofta.png": "main-58", // Veg Kofta
  "Soya Chap Masala.png": "main-66", // Soya Chaap Masala
  "Soya Chap Butter Masala.png": "main-67", // Soya Chaap Butter Masala
  "Soya Chap Curry.png": "main-139", // Soya Chap Curry
  "Soya Chap Chatpati.png": "main-138", // Soya Chap Chatpati
  "Blue Lagoon.png": "bev-185",
  "Bournvita : Hot Chocolate.png": "bev-184",
  "Choice of Health Shake.png": "bev-177",
  "Coffee.png": "bev-181",
  "Fruit Punch.png": "bev-188",
  "Health Booster.png": "bev-183",
  "Hot Milk.png": "bev-182",
  "Lassi (Sweet & Salt).png": "bev-173",
  "Litchi Cooler.png": "bev-189",
  "Mango Tango.png": "bev-187",
  "Orange Blossom.png": "bev-186",
  "Butter Milk.png": "bev-114",
  "Canned Juice.png": "bev-170",
  "Canned Soft Drink.png": "bev-171",
  "Fresh Lime Soda (Sweet & Salt).png": "bev-172",
  "Hot Coffee.png": "bev-124",
  "Masala Tea.png": "bev-180",
  "Salted Lassi.png": "bev-113",
  "Strawberry : Chocolate : Vanilla : Mango : Banana Milk Shake.png": "bev-178",
  "Tea.png": "bev-121",
  "Virgin Mojito.png": "bev-190",
  "Paneer Malai Tikka.png": "tandoor-91",
  "Veg Seekh Kabab.png": "tandoor-97",
  "Cheese Corn Sandwich.png": "sandwich-196",
  "Chilli Cheese Toasted.png": "sandwich-195",
  "Sandwich of Choice (Cheese).png": "sandwich-192",
  "Sandwich of Choice (Paneer).png": "sandwich-193",
  "Sandwich of Choice (Vegetable).png": "sandwich-191",
  "Veg Club Sandwich.png": "sandwich-194"
};

// Helper to recursively list files
function getFilesRecursively(dir, fileList = []) {
  if (!fs.existsSync(dir)) return fileList;
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const filePath = path.join(dir, file);
    if (fs.statSync(filePath).isDirectory()) {
      getFilesRecursively(filePath, fileList);
    } else {
      if (file !== ".DS_Store" && /\.(png|jpeg|jpg|webp)$/i.test(file)) {
        fileList.push(filePath);
      }
    }
  }
  return fileList;
}

// Clean string for fuzzy matching
function normalize(str) {
  return str
    .toLowerCase()
    .replace(/[^a-z0-9]/g, ""); // Keep only alphanumeric characters
}

function run() {
  console.log("Reading menu.ts...");
  if (!fs.existsSync(MENU_FILE_PATH)) {
    console.error("Error: menu.ts not found!");
    process.exit(1);
  }

  const content = fs.readFileSync(MENU_FILE_PATH, "utf8");
  const jsContent = content
    .replace(/export interface [\s\S]*?\n}/g, "")
    .replace(/: MenuCategory\[]/g, "")
    .replace(/: MenuItem\[]/g, "")
    .replace(/\bexport\s+/g, "");

  let MENU_ITEMS = [];
  try {
    const evalFn = new Function("exports", jsContent + "\nreturn { MENU_ITEMS };");
    const result = evalFn({});
    MENU_ITEMS = result.MENU_ITEMS;
  } catch (err) {
    console.error("Error evaluating menu.ts:", err);
    process.exit(1);
  }

  console.log(`Loaded ${MENU_ITEMS.length} menu items.`);

  console.log("Scanning public/assets/food/ for images...");
  const imageFiles = getFilesRecursively(PUBLIC_FOOD_DIR);
  console.log(`Found ${imageFiles.length} image files.`);

  const matches = {};
  const unmatchedFiles = [];
  
  for (const filePath of imageFiles) {
    const relativePath = "/" + path.relative(path.join(__dirname, "../public"), filePath);
    const fileName = path.basename(filePath);
    const nameWithoutExt = path.basename(filePath, path.extname(filePath));
    const normFileName = normalize(nameWithoutExt);

    // 1. Check overrides
    if (OVERRIDES[fileName]) {
      const itemId = OVERRIDES[fileName];
      matches[itemId] = relativePath;
      continue;
    }

    // 2. Identify the folder containing the file to filter by category
    const parentDirName = path.basename(path.dirname(filePath));
    const expectedCategory = CATEGORY_SLUG_MAP[parentDirName];

    // Filter menu items by this category, if it corresponds to one
    let itemsToSearch = MENU_ITEMS;
    if (expectedCategory) {
      itemsToSearch = MENU_ITEMS.filter(item => item.category === expectedCategory);
    }

    // Try exact or fuzzy match within the items
    let matchedItem = null;
    
    // First pass: exact match on normalized name or slug
    for (const item of itemsToSearch) {
      if (normalize(item.name) === normFileName || normalize(item.slug) === normFileName) {
        matchedItem = item;
        break;
      }
    }

    // Second pass: fuzzy check (includes)
    if (!matchedItem) {
      for (const item of itemsToSearch) {
        const normName = normalize(item.name);
        const normSlug = normalize(item.slug);
        if (normFileName.includes(normName) || normName.includes(normFileName) ||
            normFileName.includes(normSlug) || normSlug.includes(normFileName)) {
          matchedItem = item;
          break;
        }
      }
    }

    if (matchedItem) {
      matches[matchedItem.id] = relativePath;
    } else {
      unmatchedFiles.push({ fileName, relativePath });
    }
  }

  // Custom manual mappings / fallbacks
  matches["bread-80"] = "/assets/food/tandoori-bread/Tandoori Roti Plain.png";

  console.log(`\nMatched ${Object.keys(matches).length} files.`);
  console.log("Generating updated UPLOADS dictionary...");

  // Write new UPLOADS to the scripts
  updateScriptUploads(path.join(SCRIPTS_DIR, "update-uploaded-photos.js"), matches);
  updateScriptUploads(path.join(SCRIPTS_DIR, "automate-menu-pipeline.js"), matches);

  if (unmatchedFiles.length > 0) {
    console.log(`\nCould not match ${unmatchedFiles.length} files:`);
    for (const f of unmatchedFiles) {
      console.log(`- ${f.fileName} (${f.relativePath})`);
    }
  }
}

function updateScriptUploads(scriptPath, matches) {
  if (!fs.existsSync(scriptPath)) {
    console.error(`Script not found: ${scriptPath}`);
    return;
  }
  
  const content = fs.readFileSync(scriptPath, "utf8");
  
  // Replace the UPLOADS object definition
  const startMarker = "const UPLOADS = {";
  
  const startIndex = content.indexOf(startMarker);
  if (startIndex === -1) {
    console.error(`Could not find UPLOADS definition in ${scriptPath}`);
    return;
  }
  
  // Find matching end brace
  let openBraces = 1;
  let endIndex = -1;
  for (let i = startIndex + startMarker.length; i < content.length; i++) {
    if (content[i] === "{") openBraces++;
    if (content[i] === "}") openBraces--;
    if (openBraces === 0) {
      endIndex = i;
      break;
    }
  }
  
  if (endIndex === -1) {
    console.error(`Could not find end of UPLOADS in ${scriptPath}`);
    return;
  }
  
  // Format matches beautifully
  const formattedMatches = Object.entries(matches)
    .sort((a, b) => {
      // Sort alphabetically/numerically by key prefix (e.g. main-10 before main-2) or simple sort
      return a[0].localeCompare(b[0], undefined, { numeric: true, sensitivity: 'base' });
    })
    .map(([id, url]) => `  "${id}": "${url}"`)
    .join(",\n");
    
  const newContent = 
    content.substring(0, startIndex) + 
    "const UPLOADS = {\n" + 
    formattedMatches + 
    "\n" + 
    content.substring(endIndex);
    
  fs.writeFileSync(scriptPath, newContent, "utf8");
  console.log(`Updated ${path.basename(scriptPath)} UPLOADS object.`);
}

run();
