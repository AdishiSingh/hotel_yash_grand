/* eslint-disable */
const fs = require("fs");
const path = require("path");

const MENU_FILE_PATH = path.join(__dirname, "../src/data/menu.ts");

// Mapping of item IDs to their uploaded file paths in public/assets/food/
const UPLOADS = {
  "bev-109": "/assets/food/beverages/Mineral Water.jpeg",
  "bev-110": "/assets/food/beverages/Cold Drink.png",
  "bev-111": "/assets/food/beverages/Fresh Lime.png",
  "bev-112": "/assets/food/beverages/Sweet Lassi.png",
  "bev-113": "/assets/food/beverages/Salted Lassi.png",
  "bev-114": "/assets/food/beverages/Butter Milk.png",
  "bev-115": "/assets/food/beverages/Milk Shake(Vanilla).png",
  "bev-116": "/assets/food/beverages/Milk Shake(Chocolate).png",
  "bev-117": "/assets/food/beverages/Milk Shake(Strawberry).png",
  "bev-118": "/assets/food/beverages/Milk Shake (Butter Scotch).png",
  "bev-119": "/assets/food/beverages/Cold Coffee.png",
  "bev-120": "/assets/food/beverages/Cold Coffee with Ice Cream.png",
  "bev-121": "/assets/food/beverages/Tea.png",
  "bev-122": "/assets/food/beverages/Black Tea.png",
  "bev-124": "/assets/food/beverages/Hot Coffee.png",
  "bev-170": "/assets/food/beverages/Canned Juice.png",
  "bev-171": "/assets/food/beverages/Canned Soft Drink.png",
  "bev-172": "/assets/food/beverages/Fresh Lime Soda (Sweet & Salt).png",
  "bev-173": "/assets/food/beverages/Lassi (Sweet & Salt).png",
  "bev-177": "/assets/food/beverages/Choice of Health Shake.png",
  "bev-178": "/assets/food/beverages/Strawberry : Chocolate : Vanilla : Mango : Banana Milk Shake.png",
  "bev-180": "/assets/food/beverages/Masala Tea.png",
  "bev-181": "/assets/food/beverages/Coffee.png",
  "bev-182": "/assets/food/beverages/Hot Milk.png",
  "bev-183": "/assets/food/beverages/Health Booster.png",
  "bev-184": "/assets/food/beverages/Bournvita : Hot Chocolate.png",
  "bev-185": "/assets/food/beverages/Blue Lagoon.png",
  "bev-186": "/assets/food/beverages/Orange Blossom.png",
  "bev-187": "/assets/food/beverages/Mango Tango.png",
  "bev-188": "/assets/food/beverages/Fruit Punch.png",
  "bev-189": "/assets/food/beverages/Litchi Cooler.png",
  "bev-190": "/assets/food/beverages/Virgin Mojito.png",
  "bread-79": "/assets/food/tandoori-bread/Tandoori Roti Plain.png",
  "bread-80": "/assets/food/tandoori-bread/Tandoori Roti Plain.png",
  "bread-81": "/assets/food/tandoori-bread/Missi Roti.png",
  "bread-82": "/assets/food/tandoori-bread/Plain Naan.png",
  "bread-83": "/assets/food/tandoori-bread/Butter Naan.png",
  "bread-84": "/assets/food/tandoori-bread/Garlic Naan.png",
  "bread-85": "/assets/food/tandoori-bread/Paneer Naan.png",
  "bread-86": "/assets/food/tandoori-bread/Aloo Stuffed Kulcha.png",
  "bread-87": "/assets/food/tandoori-bread/Paneer Stuffed Kulcha.png",
  "bread-88": "/assets/food/tandoori-bread/Laccha Paratha.png",
  "bread-89": "/assets/food/tandoori-bread/Pudina Paratha.png",
  "combo-207": "/assets/food/combos/Chola Bhatura.png",
  "combo-208": "/assets/food/combos/Chola Kulcha.png",
  "combo-209": "/assets/food/combos/Veg Fried Rice & Manchurian.png",
  "combo-210": "/assets/food/combos/Veg Noodles & Manchurian.png",
  "combo-211": "/assets/food/combos/Chilli Paneer & Fried Rice.png",
  "combo-212": "/assets/food/combos/Chilli Paneer & Noodles.png",
  "combo-213": "/assets/food/combos/Rajma Chawal.png",
  "combo-214": "/assets/food/combos/Chola Chawal.png",
  "combo-215": "/assets/food/combos/Kadhi Chawal.png",
  "combo-216": "/assets/food/combos/ Paneer Butter Masala with Stuffed Kulcha.png",
  "dal-68": "/assets/food/dal/Dal Fry.png",
  "dal-69": "/assets/food/dal/Dal Double Tadka.png",
  "dal-70": "/assets/food/dal/Dal Makhani.png",
  "dal-71": "/assets/food/dal/Dal Palak.png",
  "dal-155": "/assets/food/dal/Dal Tadka.png",
  "dal-158": "/assets/food/dal/Dal Panchmel.png",
  "dal-160": "/assets/food/dal/Chole.png",
  "dal-162": "/assets/food/dal/Rajma Masala.png",
  "dal-163": "/assets/food/dal/Kadhi Pakodi.png",
  "dessert-225": "/assets/food/sweets & desserts/Choice of Ice Cream.png",
  "dessert-226": "/assets/food/sweets & desserts/Gulab Jamun.png",
  "dessert-227": "/assets/food/sweets & desserts/Shahi Kheer.png",
  "dessert-228": "/assets/food/sweets & desserts/Ice Cream with Hot Gulab Jamun.png",
  "dessert-229": "/assets/food/sweets & desserts/Shahi Tukda.png",
  "dessert-230": "/assets/food/sweets & desserts/Moong Dal Halwa.png",
  "main-38": "/assets/food/main-course/Paneer Butter Masala.png",
  "main-39": "/assets/food/main-course/Kadai Paneer.png",
  "main-40": "/assets/food/main-course/Shahi Paneer.png",
  "main-41": "/assets/food/main-course/Paneer Tikka Masala.png",
  "main-42": "/assets/food/main-course/Paneer Do Pyaza.png",
  "main-43": "/assets/food/main-course/Handi Paneer.png",
  "main-44": "/assets/food/main-course/Palak Paneer.png",
  "main-46": "/assets/food/main-course/Paneer Bhurji.png",
  "main-47": "/assets/food/main-course/Mix Veg.png",
  "main-48": "/assets/food/main-course/Veg Jhalfrezi.png",
  "main-49": "/assets/food/main-course/Veg Kolhapuri.png",
  "main-50": "/assets/food/main-course/Handi Veg.png",
  "main-51": "/assets/food/main-course/Handi Mushroom.png",
  "main-52": "/assets/food/main-course/Mushroom Do Pyaza.png",
  "main-53": "/assets/food/main-course/Kadai Mushroom.png",
  "main-54": "/assets/food/main-course/Mushroom Masala.png",
  "main-55": "/assets/food/main-course/Matar Mushroom.png",
  "main-56": "/assets/food/main-course/Matar Paneer.png",
  "main-57": "/assets/food/main-course/Malai Kofta.png",
  "main-58": "/assets/food/main-course/Vegetable Kofta.png",
  "main-59": "/assets/food/main-course/Kaju Curry.png",
  "main-60": "/assets/food/main-course/Kaju Paneer Masala.png",
  "main-61": "/assets/food/main-course/Aloo Gobhi Matar.png",
  "main-62": "/assets/food/main-course/Jeera Aloo.png",
  "main-63": "/assets/food/main-course/Dum Aloo (Kashmiri).png",
  "main-64": "/assets/food/main-course/Dum Aloo (Punjabi).png",
  "main-65": "/assets/food/main-course/Chana Masala.png",
  "main-66": "/assets/food/main-course/Soya Chap Masala.png",
  "main-67": "/assets/food/main-course/Soya Chap Butter Masala.png",
  "main-125": "/assets/food/main-course/Paneer Lababdar.png",
  "main-128": "/assets/food/main-course/Paneer Dhaniya Adraki.png",
  "main-138": "/assets/food/main-course/Soya Chap Chatpati.png",
  "main-139": "/assets/food/rice-biryani/Soya Chap Curry.png",
  "main-143": "/assets/food/main-course/Aloo Gobhi Masala.png",
  "main-144": "/assets/food/main-course/Diwani Handi.png",
  "main-145": "/assets/food/main-course/Hyderabadi Moti.png",
  "main-146": "/assets/food/main-course/Sham Savera Kofta.png",
  "main-149": "/assets/food/main-course/Aloo Zeera.png",
  "main-150": "/assets/food/main-course/Bhindi Masala.png",
  "main-151": "/assets/food/main-course/Kurkuri Bhindi.png",
  "main-152": "/assets/food/main-course/Aloo Matar.png",
  "main-153": "/assets/food/main-course/Rajma Curry.png",
  "main-154": "/assets/food/main-course/Punjabi Rajma.png",
  "momo-164": "/assets/food/momos/Mix Veg Momos.png",
  "momo-165": "/assets/food/momos/Corn Cheese Momos.png",
  "momo-166": "/assets/food/momos/Paneer Tikka Momos.png",
  "momo-167": "/assets/food/momos/Paneer Momos.png",
  "momo-168": "/assets/food/momos/Veg Peri Peri Momos.png",
  "momo-169": "/assets/food/momos/Mushroom Momos.png",
  "nonveg-234": "/assets/food/nonveg/Egg Bhurji.png",
  "nonveg-235": "/assets/food/nonveg/Egg Curry.png",
  "nonveg-236": "/assets/food/nonveg/Chicken Chilli.png",
  "nonveg-237": "/assets/food/nonveg/Chicken 65.png",
  "nonveg-238": "/assets/food/nonveg/Chicken Chowmein.png",
  "nonveg-239": "/assets/food/nonveg/Chicken Fried Rice.png",
  "nonveg-240": "/assets/food/nonveg/Chicken Anda Fry.png",
  "nonveg-241": "/assets/food/nonveg/Chicken Roll.png",
  "nonveg-242": "/assets/food/nonveg/Chicken Egg Roll.png",
  "nonveg-243": "/assets/food/nonveg/Chicken Lolipop.png",
  "nonveg-244": "/assets/food/nonveg/Chicken Tandoori.png",
  "nonveg-245": "/assets/food/nonveg/Chicken Afghani.png",
  "nonveg-246": "/assets/food/nonveg/Chicken Leg Kabab.png",
  "nonveg-247": "/assets/food/nonveg/Chicken Fry.png",
  "nonveg-248": "/assets/food/nonveg/Chicken Achari Tikka.png",
  "nonveg-249": "/assets/food/nonveg/Chicken Malai Tikka.png",
  "nonveg-250": "/assets/food/nonveg/Butter Chicken.png",
  "nonveg-251": "/assets/food/nonveg/Chicken Curry.png",
  "nonveg-252": "/assets/food/nonveg/Chicken Masala.png",
  "nonveg-253": "/assets/food/nonveg/Chicken Kaali Mirch.png",
  "nonveg-254": "/assets/food/nonveg/Chicken Mughlai.png",
  "nonveg-255": "/assets/food/nonveg/Chicken Achari.png",
  "nonveg-256": "/assets/food/nonveg/Chicken Dihari.png",
  "nonveg-257": "/assets/food/nonveg/Chicken Handi.png",
  "nonveg-258": "/assets/food/nonveg/Chicken Kadai.png",
  "nonveg-259": "/assets/food/nonveg/Chicken Do Pyaza.png",
  "nonveg-260": "/assets/food/nonveg/Chicken Tikka.png",
  "pizza-197": "/assets/food/pizza/Margherita Pizza.png",
  "pizza-198": "/assets/food/pizza/Exotic Veg Pizza.png",
  "pizza-199": "/assets/food/pizza/Mexican Veg Pizza.png",
  "pizza-200": "/assets/food/pizza/Mushroom Pizza.png",
  "pizza-201": "/assets/food/pizza/Corn Pizza.png",
  "pizza-202": "/assets/food/pizza/Onion Pizza.png",
  "pizza-203": "/assets/food/pizza/Capsicum Pizza.png",
  "pizza-204": "/assets/food/pizza/Paneer Delight Pizza.png",
  "pizza-205": "/assets/food/pizza/Paneer Tikka Pizza.png",
  "pizza-206": "/assets/food/pizza/Peri Peri Pizza.png",
  "rice-27": "/assets/food/rice-noodles/Veg Fried Rice.png",
  "rice-28": "/assets/food/rice-noodles/Schezwan Fried Rice.png",
  "rice-29": "/assets/food/rice-noodles/Paneer Fried Rice.png",
  "rice-30": "/assets/food/rice-noodles/Garlic Fried Rice.png",
  "rice-31": "/assets/food/rice-noodles/Mixed Fried Rice.png",
  "rice-32": "/assets/food/rice-noodles/Veg Noodles.png",
  "rice-33": "/assets/food/rice-noodles/Veg Hakka Noodles.png",
  "rice-34": "/assets/food/rice-noodles/Chilli Garlic Noodles.jpeg",
  "rice-35": "/assets/food/rice-noodles/Schezwan Noodles.png",
  "rice-36": "/assets/food/rice-noodles/Paneer Noodles.png",
  "rice-37": "/assets/food/rice-noodles/Mixed Noodles.png",
  "rice-72": "/assets/food/rice-biryani/Plain Rice.png",
  "rice-73": "/assets/food/rice-biryani/Jeera Rice.png",
  "rice-74": "/assets/food/rice-biryani/Peas Pulao.png",
  "rice-75": "/assets/food/rice-biryani/Veg Pulao.png",
  "rice-76": "/assets/food/rice-biryani/Veg Biryani.png",
  "rice-77": "/assets/food/rice-biryani/Paneer Biryani.png",
  "rice-78": "/assets/food/rice-biryani/Handi Biryani.png",
  "rice-217": "/assets/food/rice-biryani/Steam Rice.png",
  "rice-220": "/assets/food/rice-biryani/Matar Pulao.png",
  "rice-221": "/assets/food/rice-biryani/Kashmiri Pulao.png",
  "salad-8": "/assets/food/salad-papad/Green Salad.png",
  "salad-9": "/assets/food/salad-papad/Onion Salad.png",
  "salad-10": "/assets/food/salad-papad/Cucumber Salad.png",
  "salad-11": "/assets/food/salad-papad/Kachumber Salad.png",
  "salad-12": "/assets/food/salad-papad/Roasted Papad.png",
  "salad-13": "/assets/food/salad-papad/Fried Papad.png",
  "salad-14": "/assets/food/salad-papad/Masala Papad.png",
  "sandwich-191": "/assets/food/sandwiches/Sandwich of Choice (Vegetable).png",
  "sandwich-192": "/assets/food/sandwiches/Sandwich of Choice (Cheese).png",
  "sandwich-193": "/assets/food/sandwiches/Sandwich of Choice (Paneer).png",
  "sandwich-194": "/assets/food/sandwiches/Veg Club Sandwich.png",
  "sandwich-195": "/assets/food/sandwiches/Chilli Cheese Toasted.png",
  "sandwich-196": "/assets/food/sandwiches/Cheese Corn Sandwich.png",
  "south-98": "/assets/food/south-indian/Plain Dosa.png",
  "south-99": "/assets/food/south-indian/Masala Dosa.png",
  "south-100": "/assets/food/south-indian/Paneer Dosa.png",
  "south-101": "/assets/food/south-indian/Butter Masala Dosa.png",
  "south-102": "/assets/food/south-indian/Rava Plain Dosa.png",
  "south-103": "/assets/food/south-indian/Rava Masala Dosa.png",
  "south-104": "/assets/food/south-indian/Plain Uttapam.png",
  "south-105": "/assets/food/rice-noodles/Onion Uttapam.png",
  "south-106": "/assets/food/south-indian/Mixed Uttapam.png",
  "south-107": "/assets/food/south-indian/Idli Sambhar.png",
  "south-108": "/assets/food/south-indian/Vada Sambhar.png",
  "starter-15": "/assets/food/starter-chinese/Paneer Chilli (Dry-Gravy).png",
  "starter-16": "/assets/food/starter-chinese/Mushroom Chilli (Dry-Gravy).png",
  "starter-17": "/assets/food/starter-chinese/Veg Manchurian (Dry-Gravy).png",
  "starter-18": "/assets/food/starter-chinese/Baby Corn Chilli (Dry-Gravy).png",
  "starter-19": "/assets/food/starter-chinese/Potato Chilli.png",
  "starter-20": "/assets/food/starter-chinese/Honey Chilli Potato.png",
  "starter-21": "/assets/food/starter-chinese/Crispy Corn.png",
  "starter-22": "/assets/food/starter-chinese/French Fries.png",
  "starter-23": "/assets/food/starter-chinese/Masala French Fries.png",
  "starter-24": "/assets/food/starter-chinese/Veg Spring Roll.png",
  "starter-25": "/assets/food/starter-chinese/Paneer 65.png",
  "starter-26": "/assets/food/starter-chinese/Mushroom 65.png",
  "tandoor-90": "/assets/food/tandoor-starter/Paneer Tikka.png",
  "tandoor-91": "/assets/food/tandoor-starter/Paneer Malai Tikka.png",
  "tandoor-92": "/assets/food/tandoor-starter/Paneer Achari Tikka.png",
  "tandoor-93": "/assets/food/tandoor-starter/Mushroom Tikka.png",
  "tandoor-94": "/assets/food/tandoor-starter/Tandoori soya Chaap.png",
  "tandoor-95": "/assets/food/tandoor-starter/Malai Soya Chaap.png",
  "tandoor-96": "/assets/food/tandoor-starter/Achari Soya Chaap.png",
  "tandoor-97": "/assets/food/tandoor-starter/Veg Seekh Kabab.png",
  "thali-231": "/assets/food/thalis/Normal Thali.png",
  "thali-232": "/assets/food/thalis/Deluxe Thali.png",
  "thali-233": "/assets/food/thalis/Banarsi Special Thali.png"
};

function run() {
  console.log("Updating menu data with uploaded photos...");
  
  if (!fs.existsSync(MENU_FILE_PATH)) {
    console.error("Error: menu.ts not found!");
    process.exit(1);
  }
  
  const content = fs.readFileSync(MENU_FILE_PATH, "utf8");
  const lines = content.split(/\r?\n/);
  
  let currentItemId = "";
  let imageUpdated = false;
  let inMenuItems = false;
  
  const newLines = [];
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    
    if (line.includes("export const MENU_ITEMS")) {
      inMenuItems = true;
    }
    
    if (!inMenuItems) {
      newLines.push(line);
      continue;
    }
    
    const idMatch = line.match(/id:\s*["']([^"']+)["']/);
    if (idMatch) {
      currentItemId = idMatch[1];
      imageUpdated = false;
    }
    
    if (currentItemId && UPLOADS[currentItemId]) {
      const imgMatch = line.match(/image:\s*["']([^"']*)["']/);
      if (imgMatch) {
        const leadingSpaces = line.match(/^\s*/)[0];
        newLines.push(`${leadingSpaces}image: "${UPLOADS[currentItemId]}",`);
        console.log(`Updated ${currentItemId} -> ${UPLOADS[currentItemId]}`);
        imageUpdated = true;
        continue;
      }
    }
    
    if ((line.startsWith("  },") || line.startsWith("  }")) && currentItemId) {
      if (UPLOADS[currentItemId] && !imageUpdated) {
        if (newLines.length > 0 && !newLines[newLines.length - 1].trim().endsWith(",") && !newLines[newLines.length - 1].trim().endsWith("{")) {
          newLines[newLines.length - 1] += ",";
        }
        newLines.push(`    image: "${UPLOADS[currentItemId]}",`);
        console.log(`Inserted image for ${currentItemId} -> ${UPLOADS[currentItemId]}`);
      }
      currentItemId = "";
      imageUpdated = false;
    }
    
    newLines.push(line);
  }
  
  fs.writeFileSync(MENU_FILE_PATH, newLines.join("\n"), "utf8");
  console.log("Updated menu data successfully!");
}

run();
