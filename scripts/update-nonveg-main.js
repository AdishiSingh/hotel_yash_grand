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

// Fallback image maps for missing Main Course and Non-Veg images
const MAIN_COURSE_IMAGE_MAP = {
  "main-149": "/assets/food/main-course/Jeera Aloo.png" // Aloo Zeera -> Jeera Aloo
};

const NONVEG_IMAGE_MAP = {
  "nonveg-238": "/assets/food/rice-noodles/Veg Noodles.png", // Chicken Chowmein
  "nonveg-250": "/assets/food/main-course/Paneer Butter Masala.png", // Butter Chicken
  "nonveg-251": "/assets/food/nonveg/Chicken Do Pyaza.png", // Chicken Curry
  "nonveg-252": "/assets/food/nonveg/Chicken Do Pyaza.png", // Chicken Masala
  "nonveg-253": "/assets/food/nonveg/Chicken Afghani.png", // Chicken Kaali Mirch
  "nonveg-254": "/assets/food/nonveg/Chicken Do Pyaza.png", // Chicken Mughlai
  "nonveg-255": "/assets/food/nonveg/Chicken Achari Tikka.png", // Chicken Achari
  "nonveg-256": "/assets/food/nonveg/Chicken Fry.png", // Chicken Dihari
  "nonveg-257": "/assets/food/nonveg/Chicken Do Pyaza.png", // Chicken Handi
  "nonveg-258": "/assets/food/nonveg/Chicken Do Pyaza.png", // Chicken Kadai
  "nonveg-260": "/assets/food/nonveg/Chicken Achari Tikka.png" // Chicken Tikka
};

// Rich descriptions dictionary
const DESCRIPTIONS = {
  // Main Course items
  "main-125": "Rich cottage cheese cubes simmered in a creamy, velvety tomato and onion Lababdar gravy with grated paneer.",
  "main-128": "Tender paneer cubes infused with fragrant fresh coriander, ginger juliennes, and ground Awadhi spices.",
  "main-134": "Fresh button mushrooms and sweet green peas simmered in a mildly spiced onion-tomato curry.",
  "main-137": "Juicy soya chaap pieces cooked in a thick, spicy tomato gravy infused with roasted cumin and garms.",
  "main-138": "Tangy and fiery soya chaap tossed with chatpata green chillies, lemon juice, and aromatic herbs.",
  "main-139": "Succulent soya chaap simmered in a traditional North Indian dhaba-style gravy.",
  "main-141": "Crisp stir-fried vegetables tossed in a spicy, tangy tomato sauce with bell peppers and onions.",
  "main-143": "Homestyle spiced cauliflower florets and tender potatoes tossed with cumin, turmeric, and ginger.",
  "main-144": "Royal Mughal-style mixed vegetable curry cooked with spinach, dry fruits, and fragrant whole spices.",
  "main-145": "Signature Hyderabadi vegetable curry with pearls of koftas, aromatic herbs, and crushed pepper.",
  "main-146": "Dual-layered spinach and paneer kofta dumplings cooked in a rich, smooth tomato butter gravy.",
  "main-147": "Soft seasonal vegetable dumplings simmered in a savory, spiced onion-tomato curry.",
  "main-149": "Crispy baby potatoes tempered with roasted cumin seeds, green chillies, and fresh coriander.",
  "main-150": "Pan-fried tender okra cooked with onions, tomatoes, and home-ground Punjabi spices.",
  "main-151": "Crispy deep-fried kurkuri bhindi tossed in chatpata dry mango powder and red chilli.",
  "main-152": "Classic homestyle potatoes and green peas curry slow-cooked with fresh ginger and coriander.",
  "main-153": "Red kidney beans slow-cooked in a thick spiced gravy served with a touch of fresh cream.",
  "main-154": "Authentic Amritsari-style dark rajma simmered overnight with whole spices and butter.",

  // Non-Veg items
  "nonveg-234": "Scrambled farm eggs sautéed with onions, green chillies, tomatoes, and fresh cilantro.",
  "nonveg-235": "Hard-boiled eggs simmered in a rich, spiced dhaba-style onion-tomato gravy.",
  "nonveg-236": "Wok-tossed boneless chicken pieces with bell peppers, onions, and spicy red chilli sauce.",
  "nonveg-237": "Fiery South Indian deep-fried chicken marinated in curry leaves, yoghurt, and red chillies.",
  "nonveg-238": "Stir-fried noodles tossed with juicy chicken strips, crisp vegetables, and dark soy sauce.",
  "nonveg-239": "Aromatic jasmine rice stir-fried with diced chicken, egg scramble, and spring onions.",
  "nonveg-240": "Crispy pan-fried boiled eggs coated in a spicy chicken masala reduction.",
  "nonveg-241": "Tender chicken tikka wrapped in a warm flaky paratha with mint chutney and pickled onions.",
  "nonveg-242": "Succulent spiced chicken and fried egg wrapped together in a crisp buttery paratha.",
  "nonveg-243": "French-trimmed chicken drumettes fried crisp and served with fiery Schezwan dipping sauce.",
  "nonveg-244": "Whole chicken marinated in spiced yogurt and slow-roasted to charred perfection in tandoor.",
  "nonveg-245": "Tender chicken marinated in cream, cashew paste, and white pepper, roasted over charcoals.",
  "nonveg-246": "Juicy chicken leg quarters marinated in tandoori spices and grilled over open embers.",
  "nonveg-247": "Crispy golden deep-fried chicken pieces seasoned with southern spice mix.",
  "nonveg-248": "Boneless chicken morsels marinated in tangy pickling spices and char-grilled.",
  "nonveg-249": "Melt-in-the-mouth chicken tikka steeped in heavy cream, cheese, and cardamoms.",
  "nonveg-250": "Tandoori chicken pieces simmered in a velvety smooth, rich tomato, butter, and cashew gravy.",
  "nonveg-251": "Traditional North Indian homestyle chicken curry cooked with onions, garlic, and fresh herbs.",
  "nonveg-252": "Succulent chicken cooked in a thick roasted onion and tomato masala with whole spices.",
  "nonveg-253": "Rich chicken curry prepared with freshly ground black pepper, heavy cream, and cashew gravy.",
  "nonveg-254": "Royal Mughlai-style chicken cooked in a decadent almond, cashew, and saffron curry.",
  "nonveg-255": "Tender chicken pieces cooked in a tangy pickling spice gravy infused with mustard and fennel.",
  "nonveg-256": "Rustic Bihari-style clay-pot chicken cooked with whole garlic bulbs and mustard oil.",
  "nonveg-257": "Chicken slow-cooked in a traditional clay handi with freshly roasted whole spices.",
  "nonveg-258": "Chicken tossed in a spicy kadai gravy with crunchy bell peppers and coarsely pounded coriander.",
  "nonveg-259": "Succulent chicken pieces braised with double the quantity of caramelized onions and tomatoes.",
  "nonveg-260": "Classic tandoori-grilled boneless chicken cubes marinated in spicy yogurt and lemon."
};

let mainUpdated = 0;
let nonVegUpdated = 0;

MENU_ITEMS.forEach((item) => {
  if (item.category === "Main Course") {
    if (!item.image && MAIN_COURSE_IMAGE_MAP[item.id]) {
      item.image = MAIN_COURSE_IMAGE_MAP[item.id];
    }
    if (DESCRIPTIONS[item.id]) {
      item.description = DESCRIPTIONS[item.id];
    }
    mainUpdated++;
  } else if (item.category === "Non Veg") {
    if (!item.image && NONVEG_IMAGE_MAP[item.id]) {
      item.image = NONVEG_IMAGE_MAP[item.id];
    }
    if (DESCRIPTIONS[item.id]) {
      item.description = DESCRIPTIONS[item.id];
    }
    // Add Half / Full variants for Non-Veg tandoori & curries where appropriate
    if (item.price >= 300 && !item.variants) {
      item.variants = [
        { label: "Half", price: Math.round(item.price * 0.6) },
        { label: "Full", price: item.price }
      ];
    }
    nonVegUpdated++;
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
  console.log(`Successfully updated ${mainUpdated} Main Course items and ${nonVegUpdated} Non-Veg items in menu.ts!`);
} else {
  console.error("Could not locate MENU_ITEMS array start in menu.ts");
}
