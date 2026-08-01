export interface MenuItem {
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

export const MENU_CATEGORIES: MenuCategory[] = [
  {
    id: "all",
    label: "All Items",
    icon: "🍽"
  },
  {
    id: "salad-papad",
    label: "Salad & Papad",
    icon: "🥗"
  },
  {
    id: "starter-chinese",
    label: "Starter (Chinese)",
    icon: "🥢"
  },
  {
    id: "rice-noodles",
    label: "Rice & Noodles",
    icon: "🍜"
  },
  {
    id: "main-course",
    label: "Main Course",
    icon: "🍛"
  },
  {
    id: "dal",
    label: "Dal",
    icon: "🍲"
  },
  {
    id: "rice-biryani",
    label: "Rice & Biryani",
    icon: "🍚"
  },
  {
    id: "tandoori-bread",
    label: "Tandoori Bread",
    icon: "🫓"
  },
  {
    id: "tandoor-starter",
    label: "Tandoor Starter",
    icon: "🍢"
  },
  {
    id: "south-indian",
    label: "South Indian",
    icon: "🥞"
  },
  {
    id: "beverages",
    label: "Beverages",
    icon: "🥤"
  },
  {
    id: "momos",
    label: "Momos",
    icon: "🥟"
  },
  {
    id: "sandwiches",
    label: "Sandwiches",
    icon: "🥪"
  },
  {
    id: "pizza",
    label: "Pizza",
    icon: "🍕"
  },
  {
    id: "combos",
    label: "Combos",
    icon: "🍱"
  },
  {
    id: "sweets-desserts",
    label: "Sweets & Desserts",
    icon: "🍰"
  },
  {
    id: "thalis",
    label: "Thalis",
    icon: "🍽"
  },
  {
    id: "non-veg",
    label: "Non Veg",
    icon: "🍗"
  }
];

export const MENU_ITEMS: MenuItem[] = [
  {
    id: "salad-8",
    name: "Green Salad",
    slug: "green-salad",
    category: "Salad & Papad",
    price: 90,
    type: "veg",
    available: true,
    featured: false,
    description: "Freshly sliced onions, cucumbers, carrots, tomatoes, and green chillies served with lemon.",
    image: "/assets/food/salad-papad/Green Salad.png"
  },
  {
    id: "salad-9",
    name: "Onion Salad",
    slug: "onion-salad",
    category: "Salad & Papad",
    price: 50,
    type: "veg",
    available: true,
    featured: false,
    description: "Crispy thinly sliced onion rings sprinkled with salt, lemon juice, and chaat masala.",
    image: "/assets/food/salad-papad/Onion Salad.png"
  },
  {
    id: "salad-10",
    name: "Cucumber Salad",
    slug: "cucumber-salad",
    category: "Salad & Papad",
    price: 60,
    type: "veg",
    available: true,
    featured: false,
    description: "Chilled fresh cucumber slices tossed with light seasoning.",
    image: "/assets/food/salad-papad/Cucumber Salad.png"
  },
  {
    id: "salad-11",
    name: "Kachumber Salad",
    slug: "kachumber-salad",
    category: "Salad & Papad",
    price: 110,
    type: "veg",
    available: true,
    featured: false,
    description: "Tangy diced onions, tomatoes, and cucumbers dressed with spices, coriander, and fresh lemon.",
    image: "/assets/food/salad-papad/Kachumber Salad.png"
  },
  {
    id: "salad-12",
    name: "Roasted Papad",
    slug: "roasted-papad",
    category: "Salad & Papad",
    price: 30,
    type: "veg",
    available: true,
    featured: false,
    description: "Crisp tandoor-roasted lentil wafer.",
    image: "/assets/food/salad-papad/Roasted Papad.png"
  },
  {
    id: "salad-13",
    name: "Fried Papad",
    slug: "fried-papad",
    category: "Salad & Papad",
    price: 40,
    type: "veg",
    available: true,
    featured: false,
    description: "Deep-fried crispy lentil wafer.",
    image: "/assets/food/salad-papad/Fried Papad.png"
  },
  {
    id: "salad-14",
    name: "Masala Papad",
    slug: "masala-papad",
    category: "Salad & Papad",
    price: 70,
    type: "veg",
    available: true,
    featured: true,
    description: "Crispy papad topped with spicy chopped onions, tomatoes, coriander, and chat masala.",
    image: "/assets/food/salad-papad/Masala Papad.png"
  },
  {
    id: "starter-15",
    name: "Paneer Chilli (Dry/Gravy)",
    slug: "paneer-chilli",
    category: "Starter (Chinese)",
    price: 250,
    type: "veg",
    available: true,
    featured: true,
    spicyLevel: 1,
    description: "Cottage cheese cubes tossed with bell peppers, onions, and green chillies in a soy-garlic glaze.",
    image: "/assets/food/starter-chinese/Paneer Chilli (Dry-Gravy).png"
  },
  {
    id: "starter-16",
    name: "Mushroom Chilli (Dry/Gravy)",
    slug: "mushroom-chilli",
    category: "Starter (Chinese)",
    price: 260,
    type: "veg",
    available: true,
    featured: false,
    spicyLevel: 1,
    description: "Crispy button mushrooms stir-fried with onions and capsicum in spicy dark soy sauce.",
    image: "/assets/food/starter-chinese/Mushroom Chilli (Dry-Gravy).png"
  },
  {
    id: "starter-17",
    name: "Veg Manchurian (Dry/Gravy)",
    slug: "veg-manchurian",
    category: "Starter (Chinese)",
    price: 210,
    type: "veg",
    available: true,
    featured: false,
    description: "Deep-fried mixed vegetable balls tossed in a rich, tangy Manchurian sauce.",
    image: "/assets/food/starter-chinese/Veg Manchurian (Dry-Gravy).png"
  },
  {
    id: "starter-18",
    name: "Baby Corn Chilli (Dry/Gravy)",
    slug: "baby-corn-chilli",
    category: "Starter (Chinese)",
    price: 250,
    type: "veg",
    available: true,
    featured: false,
    spicyLevel: 1,
    description: "Crispy baby corn spears tossed with fresh capsicum, spring onions, and garlic-soya glaze.",
    image: "/assets/food/starter-chinese/Baby Corn Chilli (Dry-Gravy).png"
  },
  {
    id: "starter-19",
    name: "Potato Chilli",
    slug: "potato-chilli",
    category: "Starter (Chinese)",
    price: 180,
    type: "veg",
    available: true,
    featured: false,
    spicyLevel: 1,
    description: "Crispy potato wedges tossed with onions, green chillies, and soy sauce.",
    image: "/assets/food/starter-chinese/Potato Chilli.png"
  },
  {
    id: "starter-20",
    name: "Honey Chilli Potato",
    slug: "honey-chilli-potato",
    category: "Starter (Chinese)",
    price: 210,
    type: "veg",
    available: true,
    featured: true,
    spicyLevel: 1,
    description: "Sweet and spicy crispy potatoes coated in dark honey and fiery chilli paste.",
    image: "/assets/food/starter-chinese/Honey Chilli Potato.png"
  },
  {
    id: "starter-21",
    name: "Crispy Corn",
    slug: "crispy-corn",
    category: "Starter (Chinese)",
    price: 220,
    type: "veg",
    available: true,
    featured: false,
    description: "Crisp-fried sweet corn kernels tossed with black pepper, spring onions, and spices.",
    image: "/assets/food/starter-chinese/Crispy Corn.png"
  },
  {
    id: "starter-22",
    name: "French Fries",
    slug: "french-fries",
    category: "Starter (Chinese)",
    price: 120,
    type: "veg",
    available: true,
    featured: false,
    description: "Golden fried salted potato strips, crisp on the outside and soft inside.",
    image: "/assets/food/starter-chinese/French Fries.png"
  },
  {
    id: "starter-23",
    name: "Masala French Fries",
    slug: "masala-french-fries",
    category: "Starter (Chinese)",
    price: 140,
    type: "veg",
    available: true,
    featured: false,
    description: "Crispy golden French fries tossed in a spicy, aromatic Indian masala blend.",
    image: "/assets/food/starter-chinese/Masala French Fries.png"
  },
  {
    id: "starter-24",
    name: "Veg Spring Roll",
    slug: "veg-spring-roll",
    category: "Starter (Chinese)",
    price: 180,
    type: "veg",
    available: true,
    featured: false,
    description: "Crispy fried rolls stuffed with seasoned stir-fried vegetables and glass noodles.",
    image: "/assets/food/starter-chinese/Veg Spring Roll.png"
  },
  {
    id: "starter-25",
    name: "Paneer 65",
    slug: "paneer-65",
    category: "Starter (Chinese)",
    price: 260,
    type: "veg",
    available: true,
    featured: true,
    spicyLevel: 2,
    description: "Deep-fried paneer cubes marinated in yogurt and fiery south-Indian spices.",
    image: "/assets/food/starter-chinese/Paneer 65.png"
  },
  {
    id: "starter-26",
    name: "Mushroom 65",
    slug: "mushroom-65",
    category: "Starter (Chinese)",
    price: 270,
    type: "veg",
    available: true,
    featured: false,
    spicyLevel: 2,
    description: "Spicy and crisp fried button mushrooms marinated in traditional spices.",
    image: "/assets/food/starter-chinese/Mushroom 65.png"
  },
  {
    id: "rice-27",
    name: "Veg Fried Rice",
    slug: "veg-fried-rice",
    category: "Rice & Noodles",
    price: 180,
    type: "veg",
    available: true,
    featured: false,
    description: "Wok-tossed aromatic basmati rice stir-fried with garden fresh vegetables.",
    image: "/assets/food/rice-noodles/Veg Fried Rice.png"
  },
  {
    id: "rice-28",
    name: "Schezwan Fried Rice",
    slug: "schezwan-fried-rice",
    category: "Rice & Noodles",
    price: 200,
    type: "veg",
    available: true,
    featured: false,
    spicyLevel: 2,
    description: "Fiery fried rice tossed in a bold, house-made spicy Schezwan sauce.",
    image: "/assets/food/rice-noodles/Schezwan Fried Rice.png"
  },
  {
    id: "rice-29",
    name: "Paneer Fried Rice",
    slug: "paneer-fried-rice",
    category: "Rice & Noodles",
    price: 220,
    type: "veg",
    available: true,
    featured: false,
    description: "Savory fried rice loaded with sautéed cottage cheese chunks and veggies.",
    image: "/assets/food/rice-noodles/Paneer Fried Rice.png"
  },
  {
    id: "rice-30",
    name: "Garlic Fried Rice",
    slug: "garlic-fried-rice",
    category: "Rice & Noodles",
    price: 190,
    type: "veg",
    available: true,
    featured: false,
    description: "Fragrant stir-fried rice loaded with golden-brown toasted garlic and spring onions.",
    image: "/assets/food/rice-noodles/Garlic Fried Rice.png"
  },
  {
    id: "rice-31",
    name: "Mixed Fried Rice",
    slug: "mixed-fried-rice",
    category: "Rice & Noodles",
    price: 240,
    type: "veg",
    available: true,
    featured: true,
    description: "Grand mix of paneer, mushrooms, and seasonal vegetables tossed with fried rice.",
    image: "/assets/food/rice-noodles/Mixed Fried Rice.png"
  },
  {
    id: "rice-32",
    name: "Veg Noodles",
    slug: "veg-noodles",
    category: "Rice & Noodles",
    price: 160,
    type: "veg",
    available: true,
    featured: false,
    description: "Stir-fried soft noodles tossed with shredded cabbage, carrots, and sweet bell peppers.",
    image: "/assets/food/rice-noodles/Veg Noodles.png"
  },
  {
    id: "rice-33",
    name: "Veg Hakka Noodles",
    slug: "veg-hakka-noodles",
    category: "Rice & Noodles",
    price: 180,
    type: "veg",
    available: true,
    featured: false,
    description: "Classic street-style stir-fried Hakka noodles with soy, vinegar, and crisp greens.",
    image: "/assets/food/rice-noodles/Veg Hakka Noodles.png"
  },
  {
    id: "rice-34",
    name: "Chilli Garlic Noodles",
    slug: "chilli-garlic-noodles",
    category: "Rice & Noodles",
    price: 190,
    type: "veg",
    available: true,
    featured: true,
    spicyLevel: 1,
    description: "Fiery wok-tossed noodles coated in house chilli oil, crushed garlic cloves, and greens.",
    image: "/assets/food/rice-noodles/Chilli Garlic Noodles.jpeg"
  },
  {
    id: "rice-35",
    name: "Schezwan Noodles",
    slug: "schezwan-noodles",
    category: "Rice & Noodles",
    price: 190,
    type: "veg",
    available: true,
    featured: false,
    spicyLevel: 2,
    description: "Fiery stir-fried noodles tossed in an intensely flavorful Schezwan chili paste.",
    image: "/assets/food/rice-noodles/Schezwan Noodles.png"
  },
  {
    id: "rice-36",
    name: "Paneer Noodles",
    slug: "paneer-noodles",
    category: "Rice & Noodles",
    price: 210,
    type: "veg",
    available: true,
    featured: false,
    description: "Soft noodles stir-fried with spiced paneer cubes and crunchy vegetables.",
    image: "/assets/food/rice-noodles/Paneer Noodles.png"
  },
  {
    id: "rice-37",
    name: "Mixed Noodles",
    slug: "mixed-noodles",
    category: "Rice & Noodles",
    price: 230,
    type: "veg",
    available: true,
    featured: false,
    description: "Rich combination of paneer, mushroom, and mixed vegetables tossed with noodles.",
    image: "/assets/food/rice-noodles/Mixed Noodles.png"
  },
  {
    id: "main-38",
    name: "Paneer Butter Masala",
    slug: "paneer-butter-masala",
    category: "Main Course",
    price: 280,
    type: "veg",
    available: true,
    featured: true,
    description: "Soft paneer cubes cooked in a rich, creamy tomato and cashew-nut gravy loaded with butter.",
    image: "/assets/food/main-course/Paneer Butter Masala.png"
  },
  {
    id: "main-39",
    name: "Kadai Paneer",
    slug: "kadai-paneer",
    category: "Main Course",
    price: 280,
    type: "veg",
    available: true,
    featured: false,
    spicyLevel: 1,
    description: "Fresh paneer cooked with capsicum, onions, and fresh ground spices in a traditional iron wok.",
    image: "/assets/food/main-course/Kadai Paneer.png"
  },
  {
    id: "main-40",
    name: "Shahi Paneer",
    slug: "shahi-paneer",
    category: "Main Course",
    price: 290,
    type: "veg",
    available: true,
    featured: false,
    description: "Soft cottage cheese triangles cooked in an aromatic, velvety tomato-cashew nut gravy.",
    image: "/assets/food/main-course/Shahi Paneer.png"
  },
  {
    id: "main-41",
    name: "Paneer Tikka Masala",
    slug: "paneer-tikka-masala",
    category: "Main Course",
    price: 310,
    type: "veg",
    available: true,
    featured: true,
    spicyLevel: 1,
    description: "Clay-oven grilled paneer tikkas simmered in a rich, spiced onion-tomato masala gravy.",
    image: "/assets/food/main-course/Paneer Tikka Masala.png"
  },
  {
    id: "main-42",
    name: "Paneer Do Pyaza",
    slug: "paneer-do-pyaza",
    category: "Main Course",
    price: 280,
    type: "veg",
    available: true,
    featured: false,
    description: "Delectable dish featuring paneer chunks cooked with double-style sautéed and raw onions.",
    image: "/assets/food/main-course/Paneer Do Pyaza.png"
  },
  {
    id: "main-43",
    name: "Handi Paneer",
    slug: "handi-paneer",
    category: "Main Course",
    price: 290,
    type: "veg",
    available: true,
    featured: false,
    description: "Paneer cooked in a rich clay pot gravy containing specialized house spices and yogurt.",
    image: "/assets/food/main-course/Handi Paneer.png"
  },
  {
    id: "main-44",
    name: "Palak Paneer",
    slug: "palak-paneer",
    category: "Main Course",
    price: 260,
    type: "veg",
    available: true,
    featured: false,
    description: "Classic dish of cottage cheese cooked in a nutrient-rich, spiced spinach puree.",
    image: "/assets/food/main-course/Palak Paneer.png"
  },
  {
    id: "main-45",
    name: "Paneer Lawabdar",
    slug: "paneer-lawabdar",
    category: "Main Course",
    price: 300,
    type: "veg",
    available: true,
    featured: true,
    description: "Paneer cubes in a luscious, semi-sweet and slightly spicy tomato, onion, and grated paneer gravy.",
    image: "/assets/food/main-course/Paneer Lababdar.png"
  },
  {
    id: "main-46",
    name: "Paneer Bhurji",
    slug: "paneer-bhurji",
    category: "Main Course",
    price: 260,
    type: "veg",
    available: true,
    featured: false,
    description: "Fresh scrambled cottage cheese sautéed with green chillies, onions, tomatoes, and aromatic spices.",
    image: "/assets/food/main-course/Paneer Bhurji.png"
  },
  {
    id: "main-47",
    name: "Mix Veg",
    slug: "mix-veg",
    category: "Main Course",
    price: 220,
    type: "veg",
    available: true,
    featured: false,
    description: "Assorted seasonal vegetables tossed together with traditional Indian spices.",
    image: "/assets/food/main-course/Mix Veg.png"
  },
  {
    id: "main-48",
    name: "Veg Jalfrezi",
    slug: "veg-jalfrezi",
    category: "Main Course",
    price: 240,
    type: "veg",
    available: true,
    featured: false,
    spicyLevel: 1,
    description: "Tangy and spicy stir-fried vegetables cooked with bell peppers and onion juliennes.",
    image: "/assets/food/main-course/Veg Jhalfrezi.png"
  },
  {
    id: "main-49",
    name: "Veg Kolhapuri",
    slug: "veg-kolhapuri",
    category: "Main Course",
    price: 240,
    type: "veg",
    available: true,
    featured: false,
    spicyLevel: 3,
    description: "Extremely spicy and rich vegetable curry prepared with traditional Maharashtrian Kolhapuri spices.",
    image: "/assets/food/main-course/Veg Kolhapuri.png"
  },
  {
    id: "main-50",
    name: "Handi Veg",
    slug: "handi-veg",
    category: "Main Course",
    price: 250,
    type: "veg",
    available: true,
    featured: false,
    description: "Mixed vegetables slow-cooked in a traditional clay pot with rich, thick gravy.",
    image: "/assets/food/main-course/Handi Veg.png"
  },
  {
    id: "main-51",
    name: "Handi Mushroom",
    slug: "handi-mushroom",
    category: "Main Course",
    price: 270,
    type: "veg",
    available: true,
    featured: false,
    description: "Fresh button mushrooms slow-cooked in a handi with thick, aromatic onion gravy.",
    image: "/assets/food/main-course/Handi Mushroom.png"
  },
  {
    id: "main-52",
    name: "Mushroom Do Pyaza",
    slug: "mushroom-do-pyaza",
    category: "Main Course",
    price: 270,
    type: "veg",
    available: true,
    featured: false,
    description: "Fresh button mushrooms cooked with a generous amount of onions added in two stages.",
    image: "/assets/food/main-course/Mushroom Do Pyaza.png"
  },
  {
    id: "main-53",
    name: "Kadai Mushroom",
    slug: "kadai-mushroom",
    category: "Main Course",
    price: 270,
    type: "veg",
    available: true,
    featured: false,
    spicyLevel: 1,
    description: "Mushrooms sautéed with bell peppers and thick masala, cooked in an iron wok.",
    image: "/assets/food/main-course/Kadai Mushroom.png"
  },
  {
    id: "main-54",
    name: "Mushroom Masala",
    slug: "mushroom-masala",
    category: "Main Course",
    price: 280,
    type: "veg",
    available: true,
    featured: false,
    description: "Button mushrooms simmered in a highly seasoned tomato-onion masala gravy.",
    image: "/assets/food/main-course/Mushroom Masala.png"
  },
  {
    id: "main-55",
    name: "Mushroom Matar",
    slug: "mushroom-matar",
    category: "Main Course",
    price: 260,
    type: "veg",
    available: true,
    featured: false,
    description: "Classic pairing of tender mushrooms and sweet green peas cooked in a spiced curry.",
    image: "/assets/food/main-course/Matar Mushroom.png"
  },
  {
    id: "main-56",
    name: "Matar Paneer",
    slug: "matar-paneer",
    category: "Main Course",
    price: 250,
    type: "veg",
    available: true,
    featured: false,
    description: "Home-style delicious curry made with cottage cheese cubes and sweet green peas.",
    image: "/assets/food/main-course/Matar Paneer.png"
  },
  {
    id: "main-57",
    name: "Malai Kofta",
    slug: "malai-kofta",
    category: "Main Course",
    price: 290,
    type: "veg",
    available: true,
    featured: true,
    description: "Rich, premium dish of potato and paneer dumplings (koftas) in a sweet, creamy white gravy.",
    image: "/assets/food/main-course/Malai Kofta.png"
  },
  {
    id: "main-58",
    name: "Veg Kofta",
    slug: "veg-kofta",
    category: "Main Course",
    price: 240,
    type: "veg",
    available: true,
    featured: false,
    description: "Tasty vegetable dumplings simmered in a savory and spicy tomato-based gravy.",
    image: "/assets/food/main-course/Vegetable Kofta.png"
  },
  {
    id: "main-59",
    name: "Kaju Curry",
    slug: "kaju-curry",
    category: "Main Course",
    price: 320,
    type: "veg",
    available: true,
    featured: true,
    description: "Whole roasted cashew nuts simmered in a rich, buttery onion-tomato paste gravy.",
    image: "/assets/food/main-course/Kaju Curry.png"
  },
  {
    id: "main-60",
    name: "Kaju Paneer Masala",
    slug: "kaju-paneer-masala",
    category: "Main Course",
    price: 340,
    type: "veg",
    available: true,
    featured: true,
    description: "Cottage cheese chunks and whole cashews cooked together in a luxurious Mughlai-style gravy.",
    image: "/assets/food/main-course/Kaju Paneer Masala.png"
  },
  {
    id: "main-61",
    name: "Aloo Gobhi Matar",
    slug: "aloo-gobhi-matar",
    category: "Main Course",
    price: 180,
    type: "veg",
    available: true,
    featured: false,
    description: "Comforting dry dish made with potatoes, cauliflower, and green peas seasoned with ginger and cumin.",
    image: "/assets/food/main-course/Aloo Gobhi Matar.png"
  },
  {
    id: "main-62",
    name: "Jeera Aloo",
    slug: "jeera-aloo",
    category: "Main Course",
    price: 150,
    type: "veg",
    available: true,
    featured: false,
    description: "Simple, delicious potatoes sautéed with dry roasted cumin seeds and basic spices.",
    image: "/assets/food/main-course/Jeera Aloo.png"
  },
  {
    id: "main-63",
    name: "Dum Aloo (Kashmiri)",
    slug: "dum-aloo-kashmiri",
    category: "Main Course",
    price: 240,
    type: "veg",
    available: true,
    featured: false,
    description: "Baby potatoes slow-cooked in a spicy yogurt and dry ginger powder based gravy.",
    image: "/assets/food/main-course/Dum Aloo (Kashmiri).png"
  },
  {
    id: "main-64",
    name: "Dum Aloo (Punjabi)",
    slug: "dum-aloo-punjabi",
    category: "Main Course",
    price: 220,
    type: "veg",
    available: true,
    featured: false,
    description: "Rich Punjabi-style fried baby potatoes cooked in a tangy tomato-onion gravy.",
    image: "/assets/food/main-course/Dum Aloo (Punjabi).png"
  },
  {
    id: "main-65",
    name: "Chana Masala",
    slug: "chana-masala",
    category: "Main Course",
    price: 200,
    type: "veg",
    available: true,
    featured: false,
    description: "Tangy and spicy chickpea curry cooked with raw mango powder and warm spices.",
    image: "/assets/food/main-course/Chana Masala.png"
  },
  {
    id: "main-66",
    name: "Soya Chaap Masala",
    slug: "soya-chaap-masala",
    category: "Main Course",
    price: 250,
    type: "veg",
    available: true,
    featured: false,
    description: "Succulent soya chaap sticks cut and slow-cooked in a robust tomato-onion gravy.",
    image: "/assets/food/main-course/Soya Chap Masala.png"
  },
  {
    id: "main-67",
    name: "Soya Chaap Butter Masala",
    slug: "soya-chaap-butter-masala",
    category: "Main Course",
    price: 270,
    type: "veg",
    available: true,
    featured: false,
    description: "Tender soya chaap pieces cooked in a creamy, velvety butter gravy.",
    image: "/assets/food/main-course/Soya Chap Butter Masala.png"
  },
  {
    id: "main-125",
    name: "Paneer Lababdar",
    slug: "paneer-lababdar",
    category: "Main Course",
    price: 300,
    type: "veg",
    available: true,
    featured: false,
    image: "/assets/food/main-course/Paneer Lababdar.png",
    description: "Rich cottage cheese cubes simmered in a creamy, velvety tomato and onion Lababdar gravy with grated paneer."
  },
  {
    id: "main-128",
    name: "Paneer Dhaniya Adraki",
    slug: "paneer-dhaniya-adraki",
    category: "Main Course",
    price: 300,
    type: "veg",
    available: true,
    featured: false,
    image: "/assets/food/main-course/Paneer Dhaniya Adraki.png",
    description: "Tender paneer cubes infused with fragrant fresh coriander, ginger juliennes, and ground Awadhi spices."
  },
  {
    id: "main-134",
    name: "Matar Mushroom",
    slug: "matar-mushroom",
    category: "Main Course",
    price: 275,
    type: "veg",
    available: true,
    featured: false,
    image: "/assets/food/main-course/Matar Mushroom.png",
    description: "Fresh button mushrooms and sweet green peas simmered in a mildly spiced onion-tomato curry."
  },
  {
    id: "main-137",
    name: "Soya Chap Masala",
    slug: "soya-chap-masala",
    category: "Main Course",
    price: 300,
    type: "veg",
    available: true,
    featured: false,
    image: "/assets/food/main-course/Soya Chap Masala.png",
    description: "Juicy soya chaap pieces cooked in a thick, spicy tomato gravy infused with roasted cumin and garms."
  },
  {
    id: "main-138",
    name: "Soya Chap Chatpati",
    slug: "soya-chap-chatpati",
    category: "Main Course",
    price: 300,
    type: "veg",
    available: true,
    featured: false,
    image: "/assets/food/main-course/Soya Chap Chatpati.png",
    description: "Tangy and fiery soya chaap tossed with chatpata green chillies, lemon juice, and aromatic herbs."
  },
  {
    id: "main-139",
    name: "Soya Chap Curry",
    slug: "soya-chap-curry",
    category: "Main Course",
    price: 250,
    type: "veg",
    available: true,
    featured: false,
    image: "/assets/food/rice-biryani/Soya Chap Curry.png",
    description: "Succulent soya chaap simmered in a traditional North Indian dhaba-style gravy."
  },
  {
    id: "main-141",
    name: "Veg Jhalfrezi",
    slug: "veg-jalfrezi",
    category: "Main Course",
    price: 200,
    type: "veg",
    available: true,
    featured: false,
    image: "/assets/food/main-course/Veg Jhalfrezi.png",
    description: "Crisp stir-fried vegetables tossed in a spicy, tangy tomato sauce with bell peppers and onions."
  },
  {
    id: "main-143",
    name: "Aloo Gobhi Masala",
    slug: "aloo-gobhi-masala",
    category: "Main Course",
    price: 250,
    type: "veg",
    available: true,
    featured: false,
    image: "/assets/food/main-course/Aloo Gobhi Masala.png",
    description: "Homestyle spiced cauliflower florets and tender potatoes tossed with cumin, turmeric, and ginger."
  },
  {
    id: "main-144",
    name: "Diwani Handi",
    slug: "diwani-handi",
    category: "Main Course",
    price: 200,
    type: "veg",
    available: true,
    featured: false,
    image: "/assets/food/main-course/Diwani Handi.png",
    description: "Royal Mughal-style mixed vegetable curry cooked with spinach, dry fruits, and fragrant whole spices."
  },
  {
    id: "main-145",
    name: "Hyderabadi Moti",
    slug: "hyderabadi-moti",
    category: "Main Course",
    price: 225,
    type: "veg",
    available: true,
    featured: false,
    image: "/assets/food/main-course/Hyderabadi Moti.png",
    description: "Signature Hyderabadi vegetable curry with pearls of koftas, aromatic herbs, and crushed pepper."
  },
  {
    id: "main-146",
    name: "Sham Savera Kofta",
    slug: "sham-savera-kofta",
    category: "Main Course",
    price: 200,
    type: "veg",
    available: true,
    featured: false,
    image: "/assets/food/main-course/Sham Savera Kofta.png",
    description: "Dual-layered spinach and paneer kofta dumplings cooked in a rich, smooth tomato butter gravy."
  },
  {
    id: "main-147",
    name: "Vegetable Kofta",
    slug: "vegetable-kofta",
    category: "Main Course",
    price: 250,
    type: "veg",
    available: true,
    featured: false,
    image: "/assets/food/main-course/Vegetable Kofta.png",
    description: "Soft seasonal vegetable dumplings simmered in a savory, spiced onion-tomato curry."
  },
  {
    id: "main-149",
    name: "Aloo Zeera",
    slug: "aloo-zeera",
    category: "Main Course",
    price: 160,
    type: "veg",
    available: true,
    featured: false,
    image: "/assets/food/main-course/Aloo Zeera.png",
    description: "Crispy baby potatoes tempered with roasted cumin seeds, green chillies, and fresh coriander."
  },
  {
    id: "main-150",
    name: "Bhindi Masala",
    slug: "bhindi-masala",
    category: "Main Course",
    price: 150,
    type: "veg",
    available: true,
    featured: false,
    image: "/assets/food/main-course/Bhindi Masala.png",
    description: "Pan-fried tender okra cooked with onions, tomatoes, and home-ground Punjabi spices."
  },
  {
    id: "main-151",
    name: "Kurkuri Bhindi",
    slug: "kurkuri-bhindi",
    category: "Main Course",
    price: 160,
    type: "veg",
    available: true,
    featured: false,
    image: "/assets/food/main-course/Kurkuri Bhindi.png",
    description: "Crispy deep-fried kurkuri bhindi tossed in chatpata dry mango powder and red chilli."
  },
  {
    id: "main-152",
    name: "Aloo Matar",
    slug: "aloo-matar",
    category: "Main Course",
    price: 160,
    type: "veg",
    available: true,
    featured: false,
    image: "/assets/food/main-course/Aloo Matar.png",
    description: "Classic homestyle potatoes and green peas curry slow-cooked with fresh ginger and coriander."
  },
  {
    id: "main-153",
    name: "Rajma Curry",
    slug: "rajma-curry",
    category: "Main Course",
    price: 220,
    type: "veg",
    available: true,
    featured: false,
    image: "/assets/food/main-course/Rajma Curry.png",
    description: "Red kidney beans slow-cooked in a thick spiced gravy served with a touch of fresh cream."
  },
  {
    id: "main-154",
    name: "Punjabi Rajma",
    slug: "punjabi-rajma",
    category: "Main Course",
    price: 240,
    type: "veg",
    available: true,
    featured: false,
    image: "/assets/food/main-course/Punjabi Rajma.png",
    description: "Authentic Amritsari-style dark rajma simmered overnight with whole spices and butter."
  },
  {
    id: "dal-68",
    name: "Dal Fry",
    slug: "dal-fry",
    category: "Dal",
    price: 140,
    type: "veg",
    available: true,
    featured: false,
    description: "Yellow lentils tempered with ghee, cumin seeds, garlic, and fresh tomatoes.",
    image: "/assets/food/dal/Dal Fry.png"
  },
  {
    id: "dal-69",
    name: "Dal Double Tadka",
    slug: "dal-double-tadka",
    category: "Dal",
    price: 160,
    type: "veg",
    available: true,
    featured: false,
    description: "Lentils tempered twice with red chillies, garlic, and aromatic spices for double depth.",
    image: "/assets/food/dal/Dal Double Tadka.png"
  },
  {
    id: "dal-70",
    name: "Dal Makhani",
    slug: "dal-makhani",
    category: "Dal",
    price: 210,
    type: "veg",
    available: true,
    featured: true,
    description: "Whole black urad lentils slow-cooked overnight with fresh cream, butter, and tomatoes.",
    image: "/assets/food/dal/Dal Makhani.png"
  },
  {
    id: "dal-71",
    name: "Dal Palak",
    slug: "dal-palak",
    category: "Dal",
    price: 160,
    type: "veg",
    available: true,
    featured: false,
    description: "Yellow lentils combined with fresh spinach and tempered with garlic and cumin.",
    image: "/assets/food/dal/Dal Palak.png"
  },
  {
    id: "dal-155",
    name: "Dal Tadka",
    slug: "dal-tadka",
    category: "Dal",
    price: 150,
    type: "veg",
    available: true,
    featured: false,
    image: "/assets/food/dal/Dal Tadka.png"
  },
  {
    id: "dal-158",
    name: "Dal Panchmel",
    slug: "dal-panchmel",
    category: "Dal",
    price: 200,
    type: "veg",
    available: true,
    featured: false,
    image: "/assets/food/dal/Dal Panchmel.png"
  },
  {
    id: "dal-160",
    name: "Chole",
    slug: "chole",
    category: "Dal",
    price: 200,
    type: "veg",
    available: true,
    featured: false,
    image: "/assets/food/dal/Chole.png"
  },
  {
    id: "dal-162",
    name: "Rajma Masala",
    slug: "rajma-masala",
    category: "Dal",
    price: 200,
    type: "veg",
    available: true,
    featured: false,
    image: "/assets/food/dal/Rajma Masala.png"
  },
  {
    id: "dal-163",
    name: "Kadhi Pakodi",
    slug: "kadhi-pakodi",
    category: "Dal",
    price: 200,
    type: "veg",
    available: true,
    featured: false,
    image: "/assets/food/dal/Kadhi Pakodi.png"
  },
  {
    id: "rice-72",
    name: "Plain Rice",
    slug: "plain-rice",
    category: "Rice & Biryani",
    price: 110,
    type: "veg",
    available: true,
    featured: false,
    description: "Steamed premium basmati rice, soft and fluffy.",
    image: "/assets/food/rice-biryani/Plain Rice.png"
  },
  {
    id: "rice-73",
    name: "Jeera Rice",
    slug: "jeera-rice",
    category: "Rice & Biryani",
    price: 130,
    type: "veg",
    available: true,
    featured: false,
    description: "Fragrant basmati rice tempered with ghee and cumin seeds.",
    image: "/assets/food/rice-biryani/Jeera Rice.png"
  },
  {
    id: "rice-74",
    name: "Peas Pulao",
    slug: "peas-pulao",
    category: "Rice & Biryani",
    price: 160,
    type: "veg",
    available: true,
    featured: false,
    description: "Saffron-tinged basmati rice cooked with fresh sweet green peas and mild spices.",
    image: "/assets/food/rice-biryani/Peas Pulao.png"
  },
  {
    id: "rice-75",
    name: "Veg Pulao",
    slug: "veg-pulao",
    category: "Rice & Biryani",
    price: 180,
    type: "veg",
    available: true,
    featured: false,
    description: "Fragrant basmati rice cooked with assorted seasonal vegetables and warm spices.",
    image: "/assets/food/rice-biryani/Veg Pulao.png"
  },
  {
    id: "rice-76",
    name: "Veg Biryani",
    slug: "veg-biryani",
    category: "Rice & Biryani",
    price: 240,
    type: "veg",
    available: true,
    featured: true,
    spicyLevel: 1,
    description: "Layered basmati rice and spiced vegetables slow-cooked (dum) with saffron and mint.",
    image: "/assets/food/rice-biryani/Veg Biryani.png"
  },
  {
    id: "rice-77",
    name: "Paneer Biryani",
    slug: "paneer-biryani",
    category: "Rice & Biryani",
    price: 260,
    type: "veg",
    available: true,
    featured: false,
    description: "Layered basmati rice and marinated paneer cubes slow-cooked with aromatic spices.",
    image: "/assets/food/rice-biryani/Paneer Biryani.png"
  },
  {
    id: "rice-78",
    name: "Handi Biryani",
    slug: "handi-biryani",
    category: "Rice & Biryani",
    price: 270,
    type: "veg",
    available: true,
    featured: true,
    description: "Aromatic vegetable and paneer biryani slow dum-cooked in a traditional clay handi.",
    image: "/assets/food/rice-biryani/Handi Biryani.png"
  },
  {
    id: "rice-217",
    name: "Steam Rice",
    slug: "steam-rice",
    category: "Rice & Biryani",
    price: 150,
    type: "veg",
    available: true,
    featured: false,
    image: "/assets/food/rice-biryani/Steam Rice.png"
  },
  {
    id: "rice-220",
    name: "Matar Pulao",
    slug: "matar-pulao",
    category: "Rice & Biryani",
    price: 200,
    type: "veg",
    available: true,
    featured: false,
    image: "/assets/food/rice-biryani/Matar Pulao.png"
  },
  {
    id: "rice-221",
    name: "Kashmiri Pulao",
    slug: "kashmiri-pulao",
    category: "Rice & Biryani",
    price: 225,
    type: "veg",
    available: true,
    featured: false,
    image: "/assets/food/rice-biryani/Kashmiri Pulao.png"
  },
  {
    id: "rice-223",
    name: "Veg Dum Biryani",
    slug: "veg-dum-biryani",
    category: "Rice & Biryani",
    price: 250,
    type: "veg",
    available: true,
    featured: false,
    image: "/assets/food/rice-biryani/Veg Biryani.png"
  },
  {
    id: "bread-79",
    name: "Tandoori Roti Plain",
    slug: "tandoori-roti-plain",
    category: "Tandoori Bread",
    price: 20,
    type: "veg",
    available: true,
    featured: false,
    description: "Healthy whole wheat flatbread baked on the walls of a hot clay oven.",
    image: "/assets/food/tandoori-bread/Tandoori Roti Plain.png"
  },
  {
    id: "bread-80",
    name: "Tandoori Roti Butter",
    slug: "tandoori-roti-butter",
    category: "Tandoori Bread",
    price: 25,
    type: "veg",
    available: true,
    featured: false,
    description: "Clay-oven baked whole wheat flatbread glazed with premium fresh butter.",
    image: "/assets/food/tandoori-bread/Tandoori Roti Plain.png"
  },
  {
    id: "bread-81",
    name: "Missi Roti",
    slug: "missi-roti",
    category: "Tandoori Bread",
    price: 40,
    type: "veg",
    available: true,
    featured: false,
    description: "Traditional flatbread made with chickpea flour, wheat flour, and fine Indian spices.",
    image: "/assets/food/tandoori-bread/Missi Roti.png"
  },
  {
    id: "bread-82",
    name: "Plain Naan",
    slug: "plain-naan",
    category: "Tandoori Bread",
    price: 45,
    type: "veg",
    available: true,
    featured: false,
    description: "Baked leavened white-flour flatbread direct from the tandoor.",
    image: "/assets/food/tandoori-bread/Plain Naan.png"
  },
  {
    id: "bread-83",
    name: "Butter Naan",
    slug: "butter-naan",
    category: "Tandoori Bread",
    price: 55,
    type: "veg",
    available: true,
    featured: false,
    description: "Clay-oven baked white flour flatbread glazed with premium fresh butter.",
    image: "/assets/food/tandoori-bread/Butter Naan.png"
  },
  {
    id: "bread-84",
    name: "Garlic Naan",
    slug: "garlic-naan",
    category: "Tandoori Bread",
    price: 75,
    type: "veg",
    available: true,
    featured: true,
    description: "Soft flatbread infused with finely minced garlic, baked in the clay oven.",
    image: "/assets/food/tandoori-bread/Garlic Naan.png"
  },
  {
    id: "bread-85",
    name: "Paneer Naan",
    slug: "paneer-naan",
    category: "Tandoori Bread",
    price: 90,
    type: "veg",
    available: true,
    featured: false,
    description: "Delicious leavened flatbread stuffed with spiced grated paneer.",
    image: "/assets/food/tandoori-bread/Paneer Naan.png"
  },
  {
    id: "bread-86",
    name: "Aloo Stuffed Kulcha",
    slug: "aloo-stuffed-kulcha",
    category: "Tandoori Bread",
    price: 80,
    type: "veg",
    available: true,
    featured: false,
    description: "Crispy flatbread stuffed with highly seasoned mashed potatoes.",
    image: "/assets/food/tandoori-bread/Aloo Stuffed Kulcha.png"
  },
  {
    id: "bread-87",
    name: "Paneer Stuffed Kulcha",
    slug: "paneer-stuffed-kulcha",
    category: "Tandoori Bread",
    price: 95,
    type: "veg",
    available: true,
    featured: false,
    description: "Crispy flatbread stuffed with spiced paneer filling.",
    image: "/assets/food/tandoori-bread/Paneer Stuffed Kulcha.png"
  },
  {
    id: "bread-88",
    name: "Lachha Paratha",
    slug: "lachha-paratha",
    category: "Tandoori Bread",
    price: 50,
    type: "veg",
    available: true,
    featured: false,
    description: "Multi-layered crispy and flaky whole wheat flatbread.",
    image: "/assets/food/tandoori-bread/Laccha Paratha.png"
  },
  {
    id: "bread-89",
    name: "Pudina Paratha",
    slug: "pudina-paratha",
    category: "Tandoori Bread",
    price: 60,
    type: "veg",
    available: true,
    featured: false,
    description: "Layered wheat flatbread flavored with dried mint leaves.",
    image: "/assets/food/tandoori-bread/Pudina Paratha.png"
  },
  {
    id: "tandoor-90",
    name: "Paneer Tikka",
    slug: "paneer-tikka",
    category: "Tandoor Starter",
    price: 260,
    type: "veg",
    available: true,
    featured: false,
    description: "Spiced paneer cubes skewered with onions and peppers, roasted in the clay tandoor.",
    image: "/assets/food/tandoor-starter/Paneer Tikka.png"
  },
  {
    id: "tandoor-91",
    name: "Paneer Malai Tikka",
    slug: "paneer-malai-tikka",
    category: "Tandoor Starter",
    price: 280,
    type: "veg",
    available: true,
    featured: true,
    description: "Creamy clay-oven roasted cottage cheese chunks marinated in cardamoms and cashew paste.",
    image: "/assets/food/tandoor-starter/Paneer Malai Tikka.png"
  },
  {
    id: "tandoor-92",
    name: "Paneer Achari Tikka",
    slug: "paneer-achari-tikka",
    category: "Tandoor Starter",
    price: 270,
    type: "veg",
    available: true,
    featured: false,
    description: "Paneer cubes marinated in a pickling spice blend (achari) and cooked in the tandoor.",
    image: "/assets/food/tandoor-starter/Paneer Achari Tikka.png"
  },
  {
    id: "tandoor-93",
    name: "Mushroom Tikka",
    slug: "mushroom-tikka",
    category: "Tandoor Starter",
    price: 250,
    type: "veg",
    available: true,
    featured: false,
    description: "Button mushrooms marinated in yogurt and tikka spices, grilled to perfection.",
    image: "/assets/food/tandoor-starter/Mushroom Tikka.png"
  },
  {
    id: "tandoor-94",
    name: "Tandoori Soya Chaap",
    slug: "tandoori-soya-chaap",
    category: "Tandoor Starter",
    price: 230,
    type: "veg",
    available: true,
    featured: false,
    description: "Soya chaap sticks marinated in spiced yogurt and grilled in the clay oven.",
    image: "/assets/food/tandoor-starter/Tandoori soya Chaap.png"
  },
  {
    id: "tandoor-95",
    name: "Malai Soya Chaap",
    slug: "malai-soya-chaap",
    category: "Tandoor Starter",
    price: 250,
    type: "veg",
    available: true,
    featured: true,
    description: "Tender soya chaap marinated in cream, cheese, cashew paste, and spices, roasted in tandoor.",
    image: "/assets/food/tandoor-starter/Malai Soya Chaap.png"
  },
  {
    id: "tandoor-96",
    name: "Achari Soya Chaap",
    slug: "achari-soya-chaap",
    category: "Tandoor Starter",
    price: 240,
    type: "veg",
    available: true,
    featured: false,
    description: "Tandoor roasted soya chaap sticks coated in tangy pickling spices.",
    image: "/assets/food/tandoor-starter/Achari Soya Chaap.png"
  },
  {
    id: "tandoor-97",
    name: "Veg Seekh Kabab",
    slug: "veg-seekh-kabab",
    category: "Tandoor Starter",
    price: 210,
    type: "veg",
    available: true,
    featured: true,
    description: "Finely minced seasoned garden vegetables, skewered and finished over glowing embers.",
    image: "/assets/food/tandoor-starter/Veg Seekh Kabab.png"
  },
  {
    id: "south-98",
    name: "Plain Dosa",
    slug: "plain-dosa",
    category: "South Indian",
    price: 120,
    type: "veg",
    available: true,
    featured: false,
    description: "Golden crispy thin crepe made from fermented rice and urad dal batter, served with coconut chutney and hot sambar.",
    image: "/assets/food/south-indian/Plain Dosa.png"
  },
  {
    id: "south-99",
    name: "Masala Dosa",
    slug: "masala-dosa",
    category: "South Indian",
    price: 150,
    type: "veg",
    available: true,
    featured: true,
    description: "Crispy thin rice crepe stuffed with seasoned, tempered mashed potatoes and onions, served with chutneys and sambar.",
    image: "/assets/food/south-indian/Masala Dosa.png"
  },
  {
    id: "south-100",
    name: "Paneer Dosa",
    slug: "paneer-dosa",
    category: "South Indian",
    price: 180,
    type: "veg",
    available: true,
    featured: false,
    description: "Crispy golden rice crepe filled with spiced grated paneer, fresh coriander, and onions.",
    image: "/assets/food/south-indian/Paneer Dosa.png"
  },
  {
    id: "south-101",
    name: "Butter Masala Dosa",
    slug: "butter-masala-dosa",
    category: "South Indian",
    price: 170,
    type: "veg",
    available: true,
    featured: false,
    description: "Crispy masala dosa cooked generously with fresh white butter for an authentic South Indian flavor.",
    image: "/assets/food/south-indian/Butter Masala Dosa.png"
  },
  {
    id: "south-102",
    name: "Rava Plain Dosa",
    slug: "rava-plain-dosa",
    category: "South Indian",
    price: 130,
    type: "veg",
    available: true,
    featured: false,
    description: "Crispy, lacy crepe prepared from semolina, rice flour, cumin, and green chillies.",
    image: "/assets/food/south-indian/Rava Plain Dosa.png"
  },
  {
    id: "south-103",
    name: "Rava Masala Dosa",
    slug: "rava-masala-dosa",
    category: "South Indian",
    price: 160,
    type: "veg",
    available: true,
    featured: false,
    description: "Lacy semolina crepe stuffed with seasoned potato-onion masala, roasted cashews, and spices.",
    image: "/assets/food/south-indian/Rava Masala Dosa.png"
  },
  {
    id: "south-104",
    name: "Plain Uttapam",
    slug: "plain-uttapam",
    category: "South Indian",
    price: 125,
    type: "veg",
    available: true,
    featured: false,
    description: "Thick, soft savory rice pancake griddle-cooked till golden, served with spicy sambar and chutneys.",
    image: "/assets/food/south-indian/Plain Uttapam.png"
  },
  {
    id: "south-105",
    name: "Onion Uttapam",
    slug: "onion-uttapam",
    category: "South Indian",
    price: 140,
    type: "veg",
    available: true,
    featured: false,
    description: "Thick savory rice pancake topped with caramelized chopped onions, curry leaves, and green chillies.",
    image: "/assets/food/rice-noodles/Onion Uttapam.png"
  },
  {
    id: "south-106",
    name: "Mixed Uttapam",
    slug: "mixed-uttapam",
    category: "South Indian",
    price: 160,
    type: "veg",
    available: true,
    featured: false,
    description: "Thick rice pancake loaded with a colorful topping of finely diced tomatoes, onions, capsicum, and herbs.",
    image: "/assets/food/south-indian/Mixed Uttapam.png"
  },
  {
    id: "south-107",
    name: "Idli Sambhar (2 Pcs)",
    slug: "idli-sambhar",
    category: "South Indian",
    price: 90,
    type: "veg",
    available: true,
    featured: false,
    description: "Two soft, fluffy steamed rice-and-lentil cakes served with piping hot vegetable sambar and coconut chutney.",
    image: "/assets/food/south-indian/Idli Sambhar.png"
  },
  {
    id: "south-108",
    name: "Vada Sambhar (2 Pcs)",
    slug: "vada-sambhar",
    category: "South Indian",
    price: 100,
    type: "veg",
    available: true,
    featured: false,
    description: "Two golden crisp deep-fried savory lentil donuts served submerged in hot spiced sambar and coconut chutney.",
    image: "/assets/food/south-indian/Vada Sambhar.png"
  },
  {
    id: "bev-109",
    name: "Mineral Water",
    slug: "mineral-water",
    category: "Beverages",
    price: 20,
    type: "veg",
    available: true,
    featured: false,
    description: "Packaged premium mineral drinking water, served chilled or at room temperature.",
    image: "/assets/food/beverages/Mineral Water.jpeg",
    displayPrice: "₹20 (MRP)"
  },
  {
    id: "bev-110",
    name: "Cold Drink",
    slug: "cold-drink",
    category: "Beverages",
    price: 40,
    type: "veg",
    available: true,
    featured: false,
    description: "Chilled 300ml canned or bottled carbonated soft drinks of your choice.",
    image: "/assets/food/beverages/Cold Drink.png",
    displayPrice: "₹40 (MRP)"
  },
  {
    id: "bev-111",
    name: "Fresh Lime Soda",
    slug: "fresh-lime-soda",
    category: "Beverages",
    price: 70,
    type: "veg",
    available: true,
    featured: false,
    description: "Invigorating fresh lime soda prepared with natural lemon juice and sparkling water.",
    image: "/assets/food/beverages/Fresh Lime.png"
  },
  {
    id: "bev-112",
    name: "Sweet Lassi",
    slug: "sweet-lassi",
    category: "Beverages",
    price: 80,
    type: "veg",
    available: true,
    featured: true,
    description: "Traditional whipped yogurt lassi infused with aromatic green cardamom and saffron syrup.",
    image: "/assets/food/beverages/Sweet Lassi.png"
  },
  {
    id: "bev-113",
    name: "Salted Lassi",
    slug: "salted-lassi",
    category: "Beverages",
    price: 70,
    type: "veg",
    available: true,
    featured: false,
    description: "Chilled salted yogurt cooler spiked with roasted cumin seeds and Himalayan black salt.",
    image: "/assets/food/beverages/Salted Lassi.png"
  },
  {
    id: "bev-114",
    name: "Butter Milk",
    slug: "butter-milk",
    category: "Beverages",
    price: 50,
    type: "veg",
    available: true,
    featured: false,
    description: "Light, healthy spiced buttermilk infused with fresh coriander and green chillies.",
    image: "/assets/food/beverages/Butter Milk.png"
  },
  {
    id: "bev-115",
    name: "Milk Shake (Vanilla)",
    slug: "milk-shake-vanilla",
    category: "Beverages",
    price: 120,
    type: "veg",
    available: true,
    featured: false,
    description: "Creamy blend of whole milk and Madagascan vanilla ice cream.",
    image: "/assets/food/beverages/Milk Shake(Vanilla).png"
  },
  {
    id: "bev-116",
    name: "Milk Shake (Chocolate)",
    slug: "milk-shake-chocolate",
    category: "Beverages",
    price: 140,
    type: "veg",
    available: true,
    featured: false,
    description: "Rich blend of dark cocoa, whole milk, and chocolate ice cream.",
    image: "/assets/food/beverages/Milk Shake(Chocolate).png"
  },
  {
    id: "bev-117",
    name: "Milk Shake (Strawberry)",
    slug: "milk-shake-strawberry",
    category: "Beverages",
    price: 130,
    type: "veg",
    available: true,
    featured: false,
    description: "Luscious strawberry milk shake crafted with fresh berry puree and ice cream.",
    image: "/assets/food/beverages/Milk Shake(Strawberry).png"
  },
  {
    id: "bev-118",
    name: "Milk Shake (Butter Scotch)",
    slug: "milk-shake-butter-scotch",
    category: "Beverages",
    price: 145,
    type: "veg",
    available: true,
    featured: false,
    description: "Decadent butterscotch shake loaded with crunchy praline bits and caramel syrup.",
    image: "/assets/food/beverages/Milk Shake (Butter Scotch).png"
  },
  {
    id: "bev-119",
    name: "Cold Coffee",
    slug: "cold-coffee",
    category: "Beverages",
    price: 120,
    type: "veg",
    available: true,
    featured: false,
    description: "Whipped iced coffee blended with whole milk and dark roast espresso.",
    image: "/assets/food/beverages/Cold Coffee.png"
  },
  {
    id: "bev-120",
    name: "Cold Coffee with Ice Cream",
    slug: "cold-coffee-with-ice-cream",
    category: "Beverages",
    price: 150,
    type: "veg",
    available: true,
    featured: true,
    description: "Rich cold coffee topped with a generous scoop of artisanal vanilla ice cream.",
    image: "/assets/food/beverages/Cold Coffee with Ice Cream.png"
  },
  {
    id: "bev-121",
    name: "Tea",
    slug: "tea",
    category: "Beverages",
    price: 30,
    type: "veg",
    available: true,
    featured: false,
    description: "Traditional Indian masala chai brewed with fresh milk, ginger, and green cardamom.",
    image: "/assets/food/beverages/Tea.png"
  },
  {
    id: "bev-122",
    name: "Black Tea",
    slug: "black-tea",
    category: "Beverages",
    price: 25,
    type: "veg",
    available: true,
    featured: false,
    description: "Freshly brewed hot Assam black tea served with lemon or honey.",
    image: "/assets/food/beverages/Black Tea.png"
  },
  {
    id: "bev-123",
    name: "Green Tea",
    slug: "green-tea",
    category: "Beverages",
    price: 35,
    type: "veg",
    available: true,
    featured: false,
    description: "Antioxidant-rich organic green tea infused with subtle herbal notes.",
    image: "/assets/food/beverages/Black Tea.png"
  },
  {
    id: "bev-124",
    name: "Hot Coffee",
    slug: "hot-coffee",
    category: "Beverages",
    price: 60,
    type: "veg",
    available: true,
    featured: false,
    description: "Freshly frothed hot instant coffee made with rich milk and cocoa dusting.",
    image: "/assets/food/beverages/Hot Coffee.png"
  },
  {
    id: "bev-170",
    name: "Canned Juice",
    slug: "canned-juice",
    category: "Beverages",
    price: 100,
    type: "veg",
    available: true,
    featured: false,
    image: "/assets/food/beverages/Canned Juice.png",
    description: "Chilled premium canned fruit juice in seasonal fruit flavors."
  },
  {
    id: "bev-171",
    name: "Canned Soft Drink",
    slug: "canned-soft-drink",
    category: "Beverages",
    price: 80,
    type: "veg",
    available: true,
    featured: false,
    displayPrice: "₹80/100",
    image: "/assets/food/beverages/Canned Soft Drink.png",
    description: "Assorted chilled canned soft drinks served over crushed ice."
  },
  {
    id: "bev-172",
    name: "Fresh Lime Soda (Sweet & Salt)",
    slug: "fresh-lime-soda-sweet-salt",
    category: "Beverages",
    price: 100,
    type: "veg",
    available: true,
    featured: false,
    displayPrice: "₹100/120",
    image: "/assets/food/beverages/Fresh Lime Soda (Sweet & Salt).png",
    description: "Refreshing fizzy soda infused with fresh lime juice, sea salt, and mint."
  },
  {
    id: "bev-173",
    name: "Lassi (Sweet & Salt)",
    slug: "lassi-sweet-salt",
    category: "Beverages",
    price: 100,
    type: "veg",
    available: true,
    featured: false,
    image: "/assets/food/beverages/Lassi (Sweet & Salt).png",
    description: "Authentic North Indian thick yogurt lassi available in sweet or salted variations."
  },
  {
    id: "bev-177",
    name: "Choice of Health Shake",
    slug: "choice-of-health-shake",
    category: "Beverages",
    price: 120,
    type: "veg",
    available: true,
    featured: false,
    image: "/assets/food/beverages/Choice of Health Shake.png",
    description: "Wholesome health shake blended with fresh fruits, oats, and natural honey."
  },
  {
    id: "bev-178",
    name: "Strawberry / Chocolate / Vanilla / Mango / Banana Milk Shake",
    slug: "strawberry-chocolate-vanilla-mango-banana-milk-shake",
    category: "Beverages",
    price: 150,
    type: "veg",
    available: true,
    featured: false,
    image: "/assets/food/beverages/Strawberry : Chocolate : Vanilla : Mango : Banana Milk Shake.png",
    description: "Customizable thick milk shake choice of Strawberry, Chocolate, Vanilla, Mango, or Banana."
  },
  {
    id: "bev-180",
    name: "Masala Tea",
    slug: "masala-tea",
    category: "Beverages",
    price: 40,
    type: "veg",
    available: true,
    featured: false,
    image: "/assets/food/beverages/Masala Tea.png",
    description: "Fragrant Indian spiced tea brewed with whole cloves, cinnamon, and cardamoms."
  },
  {
    id: "bev-181",
    name: "Coffee",
    slug: "coffee",
    category: "Beverages",
    price: 50,
    type: "veg",
    available: true,
    featured: false,
    image: "/assets/food/beverages/Coffee.png",
    description: "Steaming hot handcrafted milk coffee brewed to aromatic perfection."
  },
  {
    id: "bev-182",
    name: "Hot Milk",
    slug: "hot-milk",
    category: "Beverages",
    price: 100,
    type: "veg",
    available: true,
    featured: false,
    image: "/assets/food/beverages/Hot Milk.png",
    description: "Hot whole milk served with your choice of saffron, turmeric, or sugar."
  },
  {
    id: "bev-183",
    name: "Health Booster",
    slug: "health-booster",
    category: "Beverages",
    price: 120,
    type: "veg",
    available: true,
    featured: false,
    image: "/assets/food/beverages/Health Booster.png",
    description: "Energy-boosting health drink packed with vital nutrients and crushed nuts."
  },
  {
    id: "bev-184",
    name: "Bournvita / Hot Chocolate",
    slug: "bournvita-hot-chocolate",
    category: "Beverages",
    price: 150,
    type: "veg",
    available: true,
    featured: false,
    image: "/assets/food/beverages/Bournvita : Hot Chocolate.png",
    description: "Rich chocolate hot drink prepared with Bournvita or dark hot chocolate fudge."
  },
  {
    id: "bev-185",
    name: "Blue Lagoon",
    slug: "blue-lagoon",
    category: "Beverages",
    price: 150,
    type: "veg",
    available: true,
    featured: false,
    image: "/assets/food/beverages/Blue Lagoon.png",
    description: "Vibrant blue curaçao mocktail mixed with lemon-lime soda and crushed mint."
  },
  {
    id: "bev-186",
    name: "Orange Blossom",
    slug: "orange-blossom",
    category: "Beverages",
    price: 150,
    type: "veg",
    available: true,
    featured: false,
    image: "/assets/food/beverages/Orange Blossom.png",
    description: "Exotic orange-citrus mocktail infused with fresh fruit nectar and soda."
  },
  {
    id: "bev-187",
    name: "Mango Tango",
    slug: "mango-tango",
    category: "Beverages",
    price: 150,
    type: "veg",
    available: true,
    featured: false,
    image: "/assets/food/beverages/Mango Tango.png",
    description: "Tropical mango mocktail blended with passion fruit syrup and crushed ice."
  },
  {
    id: "bev-188",
    name: "Fruit Punch",
    slug: "fruit-punch",
    category: "Beverages",
    price: 150,
    type: "veg",
    available: true,
    featured: false,
    image: "/assets/food/beverages/Fruit Punch.png",
    description: "Refreshing medley of mixed tropical fruit juices layered with sparkling soda."
  },
  {
    id: "bev-189",
    name: "Litchi Cooler",
    slug: "litchi-cooler",
    category: "Beverages",
    price: 150,
    type: "veg",
    available: true,
    featured: false,
    image: "/assets/food/beverages/Litchi Cooler.png",
    description: "Chilled litchi nectar mocktail infused with lime juice and crushed ice."
  },
  {
    id: "bev-190",
    name: "Virgin Mojito",
    slug: "virgin-mojito",
    category: "Beverages",
    price: 150,
    type: "veg",
    available: true,
    featured: false,
    image: "/assets/food/beverages/Virgin Mojito.png",
    description: "Classic Cuban-style non-alcoholic mojito with muddled fresh lime, mint leaves, and soda."
  },
  {
    id: "momo-164",
    name: "Mix Veg Momos",
    slug: "mix-veg-momos",
    category: "Momos",
    price: 160,
    type: "veg",
    available: true,
    featured: false,
    image: "/assets/food/momos/Mix Veg Momos.png"
  },
  {
    id: "momo-165",
    name: "Corn Cheese Momos",
    slug: "corn-cheese-momos",
    category: "Momos",
    price: 180,
    type: "veg",
    available: true,
    featured: false,
    image: "/assets/food/momos/Corn Cheese Momos.png"
  },
  {
    id: "momo-166",
    name: "Paneer Tikka Momos",
    slug: "paneer-tikka-momos",
    category: "Momos",
    price: 200,
    type: "veg",
    available: true,
    featured: false,
    image: "/assets/food/momos/Paneer Tikka Momos.png"
  },
  {
    id: "momo-167",
    name: "Paneer Momos",
    slug: "paneer-momos",
    category: "Momos",
    price: 200,
    type: "veg",
    available: true,
    featured: false,
    image: "/assets/food/momos/Paneer Momos.png"
  },
  {
    id: "momo-168",
    name: "Veg Peri Peri Momos",
    slug: "veg-peri-peri-momos",
    category: "Momos",
    price: 180,
    type: "veg",
    available: true,
    featured: false,
    image: "/assets/food/momos/Veg Peri Peri Momos.png"
  },
  {
    id: "momo-169",
    name: "Mushroom Momos",
    slug: "mushroom-momos",
    category: "Momos",
    price: 225,
    type: "veg",
    available: true,
    featured: false,
    image: "/assets/food/momos/Mushroom Momos.png"
  },
  {
    id: "sandwich-191",
    name: "Sandwich of Choice (Vegetable)",
    slug: "sandwich-of-choice-vegetable",
    category: "Sandwiches",
    price: 150,
    type: "veg",
    available: true,
    featured: false,
    image: "/assets/food/sandwiches/Sandwich of Choice (Vegetable).png",
    description: "Fresh garden cucumber, tomato, and bell pepper slices layered with green mint chutney between grilled bread slices."
  },
  {
    id: "sandwich-192",
    name: "Sandwich of Choice (Cheese)",
    slug: "sandwich-of-choice-cheese",
    category: "Sandwiches",
    price: 160,
    type: "veg",
    available: true,
    featured: false,
    image: "/assets/food/sandwiches/Sandwich of Choice (Cheese).png",
    description: "Golden-toasted double layer sandwich stuffed with rich melted processed cheddar and mozzarella cheese."
  },
  {
    id: "sandwich-193",
    name: "Sandwich of Choice (Paneer)",
    slug: "sandwich-of-choice-paneer",
    category: "Sandwiches",
    price: 200,
    type: "veg",
    available: true,
    featured: false,
    image: "/assets/food/sandwiches/Sandwich of Choice (Paneer).png",
    description: "Hearty grilled sandwich stuffed with seasoned cottage cheese cubes, chopped bell peppers, and special herbs."
  },
  {
    id: "sandwich-194",
    name: "Veg Club Sandwich",
    slug: "veg-club-sandwich",
    category: "Sandwiches",
    price: 225,
    type: "veg",
    available: true,
    featured: false,
    image: "/assets/food/sandwiches/Veg Club Sandwich.png",
    description: "Triple-decker toasted club sandwich filled with crisp lettuce, sliced tomatoes, spiced paneer, and cheese."
  },
  {
    id: "sandwich-195",
    name: "Chilli Cheese Toasted",
    slug: "chilli-cheese-toasted",
    category: "Sandwiches",
    price: 200,
    type: "veg",
    available: true,
    featured: false,
    image: "/assets/food/sandwiches/Chilli Cheese Toasted.png",
    description: "Spicy toasted sandwich loaded with melted cheese, chopped green chillies, and cracked black pepper."
  },
  {
    id: "sandwich-196",
    name: "Cheese Corn Sandwich",
    slug: "cheese-corn-sandwich",
    category: "Sandwiches",
    price: 200,
    type: "veg",
    available: true,
    featured: false,
    image: "/assets/food/sandwiches/Cheese Corn Sandwich.png",
    description: "Crisp toasted sandwich filled with sweet corn kernels, rich creamy mayo, and melted cheese."
  },
  {
    id: "pizza-197",
    name: "Pizza Margherita",
    slug: "pizza-margherita",
    category: "Pizza",
    price: 200,
    type: "veg",
    available: true,
    featured: false,
    image: "/assets/food/pizza/Margherita Pizza.png"
  },
  {
    id: "pizza-198",
    name: "Exotic Veg Pizza",
    slug: "exotic-veg-pizza",
    category: "Pizza",
    price: 160,
    type: "veg",
    available: true,
    featured: false,
    image: "/assets/food/pizza/Exotic Veg Pizza.png"
  },
  {
    id: "pizza-199",
    name: "Mexican Veg Pizza",
    slug: "mexican-veg-pizza",
    category: "Pizza",
    price: 160,
    type: "veg",
    available: true,
    featured: false,
    image: "/assets/food/pizza/Mexican Veg Pizza.png"
  },
  {
    id: "pizza-200",
    name: "Mushroom & Cheese Pizza",
    slug: "mushroom-cheese-pizza",
    category: "Pizza",
    price: 180,
    type: "veg",
    available: true,
    featured: false,
    image: "/assets/food/pizza/Mushroom Pizza.png"
  },
  {
    id: "pizza-201",
    name: "Corn Pizza",
    slug: "corn-pizza",
    category: "Pizza",
    price: 160,
    type: "veg",
    available: true,
    featured: false,
    image: "/assets/food/pizza/Corn Pizza.png"
  },
  {
    id: "pizza-202",
    name: "Onion Pizza",
    slug: "onion-pizza",
    category: "Pizza",
    price: 160,
    type: "veg",
    available: true,
    featured: false,
    image: "/assets/food/pizza/Onion Pizza.png"
  },
  {
    id: "pizza-203",
    name: "Capsicum Pizza",
    slug: "capsicum-pizza",
    category: "Pizza",
    price: 160,
    type: "veg",
    available: true,
    featured: false,
    image: "/assets/food/pizza/Capsicum Pizza.png"
  },
  {
    id: "pizza-204",
    name: "Paneer Delight Pizza",
    slug: "paneer-delight-pizza",
    category: "Pizza",
    price: 225,
    type: "veg",
    available: true,
    featured: false,
    image: "/assets/food/pizza/Paneer Delight Pizza.png"
  },
  {
    id: "pizza-205",
    name: "Paneer Tikka Pizza",
    slug: "paneer-tikka-pizza",
    category: "Pizza",
    price: 250,
    type: "veg",
    available: true,
    featured: false,
    image: "/assets/food/pizza/Paneer Tikka Pizza.png"
  },
  {
    id: "pizza-206",
    name: "Peri Peri Pizza",
    slug: "peri-peri-pizza",
    category: "Pizza",
    price: 250,
    type: "veg",
    available: true,
    featured: false,
    image: "/assets/food/pizza/Peri Peri Pizza.png"
  },
  {
    id: "combo-207",
    name: "Chola Bhatura",
    slug: "chola-bhatura",
    category: "Combos",
    price: 140,
    type: "veg",
    available: true,
    featured: false,
    image: "/assets/food/combos/Chola Bhatura.png"
  },
  {
    id: "combo-208",
    name: "Chola Kulcha",
    slug: "chola-kulcha",
    category: "Combos",
    price: 160,
    type: "veg",
    available: true,
    featured: false,
    image: "/assets/food/combos/Chola Kulcha.png"
  },
  {
    id: "combo-209",
    name: "Veg Fried Rice & Manchurian",
    slug: "veg-fried-rice-manchurian",
    category: "Combos",
    price: 200,
    type: "veg",
    available: true,
    featured: false,
    image: "/assets/food/combos/Veg Fried Rice & Manchurian.png"
  },
  {
    id: "combo-210",
    name: "Veg Noodles & Manchurian",
    slug: "veg-noodles-manchurian",
    category: "Combos",
    price: 200,
    type: "veg",
    available: true,
    featured: false,
    image: "/assets/food/combos/Veg Noodles & Manchurian.png"
  },
  {
    id: "combo-211",
    name: "Chilli Paneer & Fried Rice",
    slug: "chilli-paneer-fried-rice",
    category: "Combos",
    price: 200,
    type: "veg",
    available: true,
    featured: false,
    image: "/assets/food/combos/Chilli Paneer & Fried Rice.png"
  },
  {
    id: "combo-212",
    name: "Chilli Paneer & Noodles",
    slug: "chilli-paneer-noodles",
    category: "Combos",
    price: 200,
    type: "veg",
    available: true,
    featured: false,
    image: "/assets/food/combos/Chilli Paneer & Noodles.png"
  },
  {
    id: "combo-213",
    name: "Rajma Chawal",
    slug: "rajma-chawal",
    category: "Combos",
    price: 180,
    type: "veg",
    available: true,
    featured: false,
    image: "/assets/food/combos/Rajma Chawal.png"
  },
  {
    id: "combo-214",
    name: "Chola Chawal",
    slug: "chola-chawal",
    category: "Combos",
    price: 180,
    type: "veg",
    available: true,
    featured: false,
    image: "/assets/food/combos/Chola Chawal.png"
  },
  {
    id: "combo-215",
    name: "Kadhi Chawal",
    slug: "kadhi-chawal",
    category: "Combos",
    price: 180,
    type: "veg",
    available: true,
    featured: false,
    image: "/assets/food/combos/Kadhi Chawal.png"
  },
  {
    id: "combo-216",
    name: "Paneer Butter Masala with Stuffed Kulcha",
    slug: "paneer-butter-masala-with-stuffed-kulcha",
    category: "Combos",
    price: 220,
    type: "veg",
    available: true,
    featured: false,
    image: "/assets/food/combos/ Paneer Butter Masala with Stuffed Kulcha.png"
  },
  {
    id: "dessert-225",
    name: "Choice of Ice Cream",
    slug: "choice-of-ice-cream",
    category: "Sweets & Desserts",
    price: 100,
    type: "veg",
    available: true,
    featured: false,
    image: "/assets/food/sweets & desserts/Choice of Ice Cream.png"
  },
  {
    id: "dessert-226",
    name: "Gulab Jamun",
    slug: "gulab-jamun",
    category: "Sweets & Desserts",
    price: 80,
    type: "veg",
    available: true,
    featured: false,
    image: "/assets/food/sweets & desserts/Gulab Jamun.png"
  },
  {
    id: "dessert-227",
    name: "Shahi Kheer",
    slug: "shahi-kheer",
    category: "Sweets & Desserts",
    price: 80,
    type: "veg",
    available: true,
    featured: false,
    image: "/assets/food/sweets & desserts/Shahi Kheer.png"
  },
  {
    id: "dessert-228",
    name: "Ice Cream with Hot Gulab Jamun",
    slug: "ice-cream-with-hot-gulab-jamun",
    category: "Sweets & Desserts",
    price: 150,
    type: "veg",
    available: true,
    featured: false,
    image: "/assets/food/sweets & desserts/Ice Cream with Hot Gulab Jamun.png"
  },
  {
    id: "dessert-229",
    name: "Shahi Tukda",
    slug: "shahi-tukda",
    category: "Sweets & Desserts",
    price: 120,
    type: "veg",
    available: true,
    featured: false,
    image: "/assets/food/sweets & desserts/Shahi Tukda.png"
  },
  {
    id: "dessert-230",
    name: "Moong Dal Halwa",
    slug: "moong-dal-halwa",
    category: "Sweets & Desserts",
    price: 100,
    type: "veg",
    available: true,
    featured: false,
    image: "/assets/food/sweets & desserts/Moong Dal Halwa.png"
  },
  {
    id: "thali-231",
    name: "Normal Thali",
    slug: "normal-thali",
    category: "Thalis",
    price: 180,
    type: "veg",
    available: true,
    featured: false,
    image: "/assets/food/thalis/Normal Thali.png"
  },
  {
    id: "thali-232",
    name: "Deluxe Thali",
    slug: "deluxe-thali",
    category: "Thalis",
    price: 250,
    type: "veg",
    available: true,
    featured: false,
    image: "/assets/food/thalis/Deluxe Thali.png"
  },
  {
    id: "thali-233",
    name: "Banarsi Special Thali",
    slug: "banarsi-special-thali",
    category: "Thalis",
    price: 350,
    type: "veg",
    available: true,
    featured: false,
    image: "/assets/food/thalis/Banarsi Special Thali.png"
  },
  {
    id: "nonveg-234",
    name: "Egg Bhurji",
    slug: "egg-bhurji",
    category: "Non Veg",
    price: 220,
    type: "non-veg",
    available: true,
    featured: false,
    image: "/assets/food/nonveg/Egg Bhurji.png",
    description: "Scrambled farm eggs sautéed with onions, green chillies, tomatoes, and fresh cilantro."
  },
  {
    id: "nonveg-235",
    name: "Egg Curry",
    slug: "egg-curry",
    category: "Non Veg",
    price: 280,
    type: "non-veg",
    available: true,
    featured: false,
    image: "/assets/food/nonveg/Egg Curry.png",
    description: "Hard-boiled eggs simmered in a rich, spiced dhaba-style onion-tomato gravy."
  },
  {
    id: "nonveg-236",
    name: "Chicken Chilli",
    slug: "chicken-chilli",
    category: "Non Veg",
    price: 350,
    type: "non-veg",
    available: true,
    featured: false,
    variants: [
      {
        "label": "16 Pieces",
        price: 350
      }
    ],
    image: "/assets/food/nonveg/Chicken Chilli.png",
    description: "Wok-tossed boneless chicken pieces with bell peppers, onions, and spicy red chilli sauce."
  },
  {
    id: "nonveg-237",
    name: "Chicken 65",
    slug: "chicken-65",
    category: "Non Veg",
    price: 370,
    type: "non-veg",
    available: true,
    featured: false,
    variants: [
      {
        "label": "8 Pieces",
        price: 370
      }
    ],
    image: "/assets/food/nonveg/Chicken 65.png",
    description: "Fiery South Indian deep-fried chicken marinated in curry leaves, yoghurt, and red chillies."
  },
  {
    id: "nonveg-238",
    name: "Chicken Chowmein",
    slug: "chicken-chowmein",
    category: "Non Veg",
    price: 310,
    type: "non-veg",
    available: true,
    featured: false,
    image: "/assets/food/nonveg/Chicken Chowmein.png",
    description: "Stir-fried noodles tossed with juicy chicken strips, crisp vegetables, and dark soy sauce.",
    variants: [
      {
        "label": "Half",
        price: 186
      },
      {
        "label": "Full",
        price: 310
      }
    ]
  },
  {
    id: "nonveg-239",
    name: "Chicken Fried Rice",
    slug: "chicken-fried-rice",
    category: "Non Veg",
    price: 290,
    type: "non-veg",
    available: true,
    featured: false,
    image: "/assets/food/nonveg/Chicken Fried Rice.png",
    description: "Aromatic jasmine rice stir-fried with diced chicken, egg scramble, and spring onions."
  },
  {
    id: "nonveg-240",
    name: "Chicken Anda Fry",
    slug: "chicken-anda-fry",
    category: "Non Veg",
    price: 310,
    type: "non-veg",
    available: true,
    featured: false,
    image: "/assets/food/nonveg/Chicken Anda Fry.png",
    description: "Crispy pan-fried boiled eggs coated in a spicy chicken masala reduction.",
    variants: [
      {
        "label": "Half",
        price: 186
      },
      {
        "label": "Full",
        price: 310
      }
    ]
  },
  {
    id: "nonveg-241",
    name: "Chicken Roll",
    slug: "chicken-roll",
    category: "Non Veg",
    price: 170,
    type: "non-veg",
    available: true,
    featured: false,
    image: "/assets/food/nonveg/Chicken Roll.png",
    description: "Tender chicken tikka wrapped in a warm flaky paratha with mint chutney and pickled onions."
  },
  {
    id: "nonveg-242",
    name: "Chicken Egg Roll",
    slug: "chicken-egg-roll",
    category: "Non Veg",
    price: 180,
    type: "non-veg",
    available: true,
    featured: false,
    image: "/assets/food/nonveg/Chicken Egg Roll.png",
    description: "Succulent spiced chicken and fried egg wrapped together in a crisp buttery paratha."
  },
  {
    id: "nonveg-243",
    name: "Chicken Lollipop",
    slug: "chicken-lollipop",
    category: "Non Veg",
    price: 599,
    type: "non-veg",
    available: true,
    featured: false,
    variants: [
      {
        "label": "8 Pieces",
        price: 599
      }
    ],
    image: "/assets/food/nonveg/Chicken Lolipop.png",
    description: "French-trimmed chicken drumettes fried crisp and served with fiery Schezwan dipping sauce."
  },
  {
    id: "nonveg-244",
    name: "Chicken Tandoori",
    slug: "chicken-tandoori",
    category: "Non Veg",
    price: 350,
    type: "non-veg",
    available: true,
    featured: false,
    variants: [
      {
        "label": "4 Pieces",
        price: 350
      },
      {
        "label": "8 Pieces",
        price: 700
      }
    ],
    image: "/assets/food/nonveg/Chicken Tandoori.png",
    description: "Whole chicken marinated in spiced yogurt and slow-roasted to charred perfection in tandoor."
  },
  {
    id: "nonveg-245",
    name: "Chicken Afghani",
    slug: "chicken-afghani",
    category: "Non Veg",
    price: 390,
    type: "non-veg",
    available: true,
    featured: false,
    variants: [
      {
        "label": "4 Pieces",
        price: 390
      },
      {
        "label": "8 Pieces",
        price: 720
      }
    ],
    image: "/assets/food/nonveg/Chicken Afghani.png",
    description: "Tender chicken marinated in cream, cashew paste, and white pepper, roasted over charcoals."
  },
  {
    id: "nonveg-246",
    name: "Chicken Leg Kabab",
    slug: "chicken-leg-kabab",
    category: "Non Veg",
    price: 400,
    type: "non-veg",
    available: true,
    featured: false,
    variants: [
      {
        "label": "4 Pieces",
        price: 400
      }
    ],
    image: "/assets/food/nonveg/Chicken Leg Kabab.png",
    description: "Juicy chicken leg quarters marinated in tandoori spices and grilled over open embers."
  },
  {
    id: "nonveg-247",
    name: "Chicken Fry",
    slug: "chicken-fry",
    category: "Non Veg",
    price: 350,
    type: "non-veg",
    available: true,
    featured: false,
    variants: [
      {
        "label": "4 Pieces",
        price: 350
      },
      {
        "label": "8 Pieces",
        price: 650
      }
    ],
    image: "/assets/food/nonveg/Chicken Fry.png",
    description: "Crispy golden deep-fried chicken pieces seasoned with southern spice mix."
  },
  {
    id: "nonveg-248",
    name: "Chicken Achari Tikka",
    slug: "chicken-achari-tikka",
    category: "Non Veg",
    price: 400,
    type: "non-veg",
    available: true,
    featured: false,
    variants: [
      {
        "label": "8 Pieces",
        price: 400
      }
    ],
    image: "/assets/food/nonveg/Chicken Achari Tikka.png",
    description: "Boneless chicken morsels marinated in tangy pickling spices and char-grilled."
  },
  {
    id: "nonveg-249",
    name: "Chicken Malai Tikka",
    slug: "chicken-malai-tikka",
    category: "Non Veg",
    price: 410,
    type: "non-veg",
    available: true,
    featured: false,
    variants: [
      {
        "label": "8 Pieces",
        price: 410
      }
    ],
    image: "/assets/food/nonveg/Chicken Malai Tikka.png",
    description: "Melt-in-the-mouth chicken tikka steeped in heavy cream, cheese, and cardamoms."
  },
  {
    id: "nonveg-250",
    name: "Butter Chicken",
    slug: "butter-chicken",
    category: "Non Veg",
    price: 400,
    type: "non-veg",
    available: true,
    featured: false,
    variants: [
      {
        "label": "4 Pieces",
        price: 400
      }
    ],
    image: "/assets/food/nonveg/Butter Chicken.png",
    description: "Tandoori chicken pieces simmered in a velvety smooth, rich tomato, butter, and cashew gravy."
  },
  {
    id: "nonveg-251",
    name: "Chicken Curry",
    slug: "chicken-curry",
    category: "Non Veg",
    price: 300,
    type: "non-veg",
    available: true,
    featured: false,
    variants: [
      {
        "label": "4 Pieces",
        price: 300
      },
      {
        "label": "8 Pieces",
        price: 600
      }
    ],
    image: "/assets/food/nonveg/Chicken Curry.png",
    description: "Traditional North Indian homestyle chicken curry cooked with onions, garlic, and fresh herbs."
  },
  {
    id: "nonveg-252",
    name: "Chicken Masala",
    slug: "chicken-masala",
    category: "Non Veg",
    price: 320,
    type: "non-veg",
    available: true,
    featured: false,
    variants: [
      {
        "label": "4 Pieces",
        price: 320
      },
      {
        "label": "8 Pieces",
        price: 620
      }
    ],
    image: "/assets/food/nonveg/Chicken Masala.png",
    description: "Succulent chicken cooked in a thick roasted onion and tomato masala with whole spices."
  },
  {
    id: "nonveg-253",
    name: "Chicken Kaali Mirch",
    slug: "chicken-kaali-mirch",
    category: "Non Veg",
    price: 350,
    type: "non-veg",
    available: true,
    featured: false,
    variants: [
      {
        "label": "4 Pieces",
        price: 350
      },
      {
        "label": "8 Pieces",
        price: 690
      }
    ],
    image: "/assets/food/nonveg/Chicken Kaali Mirch.png",
    description: "Rich chicken curry prepared with freshly ground black pepper, heavy cream, and cashew gravy."
  },
  {
    id: "nonveg-254",
    name: "Chicken Mughlai",
    slug: "chicken-mughlai",
    category: "Non Veg",
    price: 340,
    type: "non-veg",
    available: true,
    featured: false,
    variants: [
      {
        "label": "4 Pieces",
        price: 340
      },
      {
        "label": "8 Pieces",
        price: 670
      }
    ],
    image: "/assets/food/nonveg/Chicken Mughlai.png",
    description: "Royal Mughlai-style chicken cooked in a decadent almond, cashew, and saffron curry."
  },
  {
    id: "nonveg-255",
    name: "Chicken Achari",
    slug: "chicken-achari",
    category: "Non Veg",
    price: 330,
    type: "non-veg",
    available: true,
    featured: false,
    variants: [
      {
        "label": "4 Pieces",
        price: 330
      },
      {
        "label": "8 Pieces",
        price: 680
      }
    ],
    image: "/assets/food/nonveg/Chicken Achari.png",
    description: "Tender chicken pieces cooked in a tangy pickling spice gravy infused with mustard and fennel."
  },
  {
    id: "nonveg-256",
    name: "Chicken Dihari",
    slug: "chicken-dihari",
    category: "Non Veg",
    price: 370,
    type: "non-veg",
    available: true,
    featured: false,
    variants: [
      {
        "label": "4 Pieces",
        price: 370
      },
      {
        "label": "8 Pieces",
        price: 690
      }
    ],
    image: "/assets/food/nonveg/Chicken Dihari.png",
    description: "Rustic Bihari-style clay-pot chicken cooked with whole garlic bulbs and mustard oil."
  },
  {
    id: "nonveg-257",
    name: "Chicken Handi",
    slug: "chicken-handi",
    category: "Non Veg",
    price: 350,
    type: "non-veg",
    available: true,
    featured: false,
    variants: [
      {
        "label": "4 Pieces",
        price: 350
      },
      {
        "label": "8 Pieces",
        price: 670
      }
    ],
    image: "/assets/food/nonveg/Chicken Handi.png",
    description: "Chicken slow-cooked in a traditional clay handi with freshly roasted whole spices."
  },
  {
    id: "nonveg-258",
    name: "Chicken Kadai",
    slug: "chicken-kadai",
    category: "Non Veg",
    price: 340,
    type: "non-veg",
    available: true,
    featured: false,
    variants: [
      {
        "label": "4 Pieces",
        price: 340
      },
      {
        "label": "8 Pieces",
        price: 680
      }
    ],
    image: "/assets/food/nonveg/Chicken Kadai.png",
    description: "Chicken tossed in a spicy kadai gravy with crunchy bell peppers and coarsely pounded coriander."
  },
  {
    id: "nonveg-259",
    name: "Chicken Do Pyaza",
    slug: "chicken-do-pyaza",
    category: "Non Veg",
    price: 350,
    type: "non-veg",
    available: true,
    featured: false,
    variants: [
      {
        "label": "4 Pieces",
        price: 350
      },
      {
        "label": "8 Pieces",
        price: 690
      }
    ],
    image: "/assets/food/nonveg/Chicken Do Pyaza.png",
    description: "Succulent chicken pieces braised with double the quantity of caramelized onions and tomatoes."
  },
  {
    id: "nonveg-260",
    name: "Chicken Tikka",
    slug: "chicken-tikka",
    category: "Non Veg",
    price: 370,
    type: "non-veg",
    available: true,
    featured: false,
    variants: [
      {
        "label": "8 Pieces",
        price: 370
      }
    ],
    image: "/assets/food/nonveg/Chicken Tikka.png",
    description: "Classic tandoori-grilled boneless chicken cubes marinated in spicy yogurt and lemon."
  },
  {
    id: "starter-261",
    name: "Veg Kathi Roll",
    slug: "veg-kathi-roll",
    category: "Starter (Chinese)",
    price: 200,
    type: "veg",
    available: true,
    featured: false,
    description: "Delicious freshly prepared Veg Kathi Roll served hot with signature mint and garlic dips.",
    image: "/assets/food/starter-chinese/Veg Spring Roll.png",
    preparationTime: "15m"
  },
  {
    id: "starter-262",
    name: "Paneer Pakoda",
    slug: "paneer-pakoda",
    category: "Starter (Chinese)",
    price: 250,
    type: "veg",
    available: true,
    featured: false,
    description: "Delicious freshly prepared Paneer Pakoda served hot with signature mint and garlic dips.",
    image: "/assets/food/starter-chinese/Paneer 65.png",
    preparationTime: "15m"
  },
  {
    id: "starter-263",
    name: "Crispy Baby Corn",
    slug: "crispy-baby-corn",
    category: "Starter (Chinese)",
    price: 250,
    type: "veg",
    available: true,
    featured: false,
    description: "Delicious freshly prepared Crispy Baby Corn served hot with signature mint and garlic dips.",
    image: "/assets/food/starter-chinese/Crispy Corn.png",
    preparationTime: "15m"
  },
  {
    id: "starter-264",
    name: "Paneer Kathi Roll",
    slug: "paneer-kathi-roll",
    category: "Starter (Chinese)",
    price: 170,
    type: "veg",
    available: true,
    featured: false,
    description: "Delicious freshly prepared Paneer Kathi Roll served hot with signature mint and garlic dips.",
    image: "/assets/food/starter-chinese/Veg Spring Roll.png",
    preparationTime: "15m"
  },
  {
    id: "starter-265",
    name: "Cheese Corn Tikki",
    slug: "cheese-corn-tikki",
    category: "Starter (Chinese)",
    price: 225,
    type: "veg",
    available: true,
    featured: false,
    description: "Delicious freshly prepared Cheese Corn Tikki served hot with signature mint and garlic dips.",
    image: "/assets/food/starter-chinese/Crispy Corn.png",
    preparationTime: "15m"
  },
  {
    id: "starter-266",
    name: "Paneer Finger",
    slug: "paneer-finger",
    category: "Starter (Chinese)",
    price: 250,
    type: "veg",
    available: true,
    featured: false,
    description: "Delicious freshly prepared Paneer Finger served hot with signature mint and garlic dips.",
    image: "/assets/food/starter-chinese/French Fries.png",
    preparationTime: "15m"
  },
  {
    id: "starter-267",
    name: "Soya Chilli",
    slug: "soya-chilli",
    category: "Starter (Chinese)",
    price: 220,
    type: "veg",
    available: true,
    featured: false,
    description: "Delicious freshly prepared Soya Chilli served hot with signature mint and garlic dips.",
    image: "/assets/food/starter-chinese/Potato Chilli.png",
    preparationTime: "15m"
  },
  {
    id: "starter-268",
    name: "Mushroom Salt and Pepper",
    slug: "mushroom-salt-and-pepper",
    category: "Starter (Chinese)",
    price: 250,
    type: "veg",
    available: true,
    featured: false,
    description: "Delicious freshly prepared Mushroom Salt and Pepper served hot with signature mint and garlic dips.",
    image: "/assets/food/starter-chinese/Mushroom 65.png",
    preparationTime: "15m"
  },
  {
    id: "starter-269",
    name: "Dahi Ke Kabab",
    slug: "dahi-ke-kabab",
    category: "Starter (Chinese)",
    price: 250,
    type: "veg",
    available: true,
    featured: false,
    description: "Delicious freshly prepared Dahi Ke Kabab served hot with signature mint and garlic dips.",
    image: "/assets/food/starter-chinese/Crispy Corn.png",
    preparationTime: "15m"
  },
  {
    id: "starter-270",
    name: "American Corn Salt and Pepper",
    slug: "american-corn-salt-and-pepper",
    category: "Starter (Chinese)",
    price: 220,
    type: "veg",
    available: true,
    featured: false,
    description: "Delicious freshly prepared American Corn Salt and Pepper served hot with signature mint and garlic dips.",
    image: "/assets/food/starter-chinese/Crispy Corn.png",
    preparationTime: "15m"
  },
  {
    id: "starter-271",
    name: "Dahi Ke Sholay",
    slug: "dahi-ke-sholay",
    category: "Starter (Chinese)",
    price: 180,
    type: "veg",
    available: true,
    featured: false,
    description: "Delicious freshly prepared Dahi Ke Sholay served hot with signature mint and garlic dips.",
    image: "/assets/food/starter-chinese/Veg Spring Roll.png",
    preparationTime: "15m"
  },
  {
    id: "starter-272",
    name: "Veg Cutlet",
    slug: "veg-cutlet",
    category: "Starter (Chinese)",
    price: 180,
    type: "veg",
    available: true,
    featured: false,
    description: "Delicious freshly prepared Veg Cutlet served hot with signature mint and garlic dips.",
    image: "/assets/food/starter-chinese/Crispy Corn.png",
    preparationTime: "15m"
  },
  {
    id: "starter-273",
    name: "Veg Pakoda",
    slug: "veg-pakoda",
    category: "Starter (Chinese)",
    price: 180,
    type: "veg",
    available: true,
    featured: false,
    description: "Delicious freshly prepared Veg Pakoda served hot with signature mint and garlic dips.",
    image: "/assets/food/starter-chinese/Crispy Corn.png",
    preparationTime: "15m"
  },
  {
    id: "starter-274",
    name: "Cheese Kurkure",
    slug: "cheese-kurkure",
    category: "Starter (Chinese)",
    price: 250,
    type: "veg",
    available: true,
    featured: false,
    description: "Delicious freshly prepared Cheese Kurkure served hot with signature mint and garlic dips.",
    image: "/assets/food/starter-chinese/Crispy Corn.png",
    preparationTime: "15m"
  },
  {
    id: "starter-275",
    name: "Paneer Kurkure",
    slug: "paneer-kurkure",
    category: "Starter (Chinese)",
    price: 250,
    type: "veg",
    available: true,
    featured: false,
    description: "Delicious freshly prepared Paneer Kurkure served hot with signature mint and garlic dips.",
    image: "/assets/food/starter-chinese/Paneer 65.png",
    preparationTime: "15m"
  },
  {
    id: "starter-276",
    name: "Paneer & Cheese Cigar Roll",
    slug: "paneer-cheese-cigar-roll",
    category: "Starter (Chinese)",
    price: 275,
    type: "veg",
    available: true,
    featured: false,
    description: "Delicious freshly prepared Paneer & Cheese Cigar Roll served hot with signature mint and garlic dips.",
    image: "/assets/food/starter-chinese/Veg Spring Roll.png",
    preparationTime: "15m"
  },
  {
    id: "starter-277",
    name: "Veg Burger",
    slug: "veg-burger",
    category: "Starter (Chinese)",
    price: 100,
    type: "veg",
    available: true,
    featured: false,
    description: "Delicious freshly prepared Veg Burger served hot with signature mint and garlic dips.",
    image: "/assets/food/starter-chinese/French Fries.png",
    preparationTime: "15m"
  },
  {
    id: "starter-278",
    name: "Gobhi Manchurian (Dry/Gravy)",
    slug: "gobhi-manchurian-dry-gravy",
    category: "Starter (Chinese)",
    price: 150,
    type: "veg",
    available: true,
    featured: false,
    description: "Delicious freshly prepared Gobhi Manchurian (Dry/Gravy) served hot with signature mint and garlic dips.",
    image: "/assets/food/starter-chinese/Veg Manchurian (Dry-Gravy).png",
    preparationTime: "15m"
  }
];
