export interface MenuItem {
  id: string;
  category: string;
  name: string;
  price: string;
  priceValue: number;
  description: string;
  imageUrl?: string;
  type: "veg" | "non-veg";
  isChefRecommendation?: boolean;
  isPopular?: boolean;
  isNew?: boolean;
}

export interface MenuCategory {
  id: string;
  label: string;
  icon: string;
}

export const RESTAURANT_CATEGORIES: MenuCategory[] = [
  { id: "all", label: "All Dishes", icon: "🍽" },
  { id: "specials", label: "Chef's Specials", icon: "⭐" },
  { id: "starters", label: "Starters", icon: "🥗" },
  { id: "tandoor", label: "Tandoor Grills", icon: "🥟" },
  { id: "chinese", label: "Chinese Wok", icon: "🍜" },
  { id: "north-indian", label: "North Indian", icon: "🍛" },
  { id: "breads", label: "Breads", icon: "🫓" },
  { id: "beverages", label: "Beverages", icon: "🥤" },
];

export const RESTAURANT_ITEMS: MenuItem[] = [
  {
    id: "malai-paneer-tikka",
    category: "tandoor",
    name: "Malai Paneer Tikka",
    price: "INR 360",
    priceValue: 360,
    description: "Creamy clay-oven roasted cottage cheese chunks marinated in cardamoms and cashew paste.",
    imageUrl: "/assets/food/malaipaneertikka.png",
    type: "veg",
    isChefRecommendation: true,
    isPopular: true,
  },
  {
    id: "mix-veg-kabab",
    category: "tandoor",
    name: "Mix Veg Kabab",
    price: "INR 280",
    priceValue: 280,
    description: "Finely minced seasoned garden vegetables, skewered and finished over glowing embers.",
    imageUrl: "/assets/food/mixvegkabab.png",
    type: "veg",
    isPopular: true,
  },
  {
    id: "baby-corn-chilli",
    category: "chinese",
    name: "Baby Corn Chilli",
    price: "INR 290",
    priceValue: 290,
    description: "Crispy baby corn spears tossed with fresh capsicum, spring onions, and garlic-soya glaze.",
    imageUrl: "/assets/food/babycornchilli.png",
    type: "veg",
    isNew: true,
  },
  {
    id: "chilli-garlic-noodles",
    category: "chinese",
    name: "Chilli Garlic Noodles",
    price: "INR 260",
    priceValue: 260,
    description: "Fiery wok-tossed noodles coated in house chilli oil, crushed garlic cloves, and greens.",
    imageUrl: "/assets/food/chilligarlicnoodles.jpeg",
    type: "veg",
    isChefRecommendation: true,
  },
  {
    id: "veg-noodles",
    category: "chinese",
    name: "Veg Noodles",
    price: "INR 240",
    priceValue: 240,
    description: "Stir-fried soft noodles tossed with shredded cabbage, carrots, and sweet bell peppers.",
    imageUrl: "/assets/food/vegnoodles.png",
    type: "veg",
  },
  {
    id: "utpam",
    category: "starters",
    name: "Utpam",
    price: "INR 180",
    priceValue: 180,
    description: "Traditional savory rice batter griddle pancake topped with diced onions and green chillies.",
    imageUrl: "/assets/food/utpam.png",
    type: "veg",
    isPopular: true,
  },
  {
    id: "special-tea",
    category: "beverages",
    name: "Special Tea",
    price: "INR 80",
    priceValue: 80,
    description: "Varanasi heritage style robust milk tea brewed with crushed cardamoms and fresh ginger root.",
    imageUrl: "/assets/food/tea.png",
    type: "veg",
    isPopular: true,
  },
  {
    id: "fresh-juices",
    category: "beverages",
    name: "Fresh Fruit Juice",
    price: "INR 150",
    priceValue: 150,
    description: "Pressed seasonal fresh fruit nectar, cold served with mint leaf highlights.",
    imageUrl: "/assets/food/beverages.png",
    type: "veg",
  },
  {
    id: "shahi-paneer",
    category: "north-indian",
    name: "Shahi Paneer",
    price: "INR 320",
    priceValue: 320,
    description: "Soft cottage cheese triangles cooked in an aromatic, velvety tomato-cashew nut gravy.",
    type: "veg",
    isPopular: true,
  },
  {
    id: "dal-makhani",
    category: "north-indian",
    name: "Dal Makhani",
    price: "INR 280",
    priceValue: 280,
    description: "Whole black urad lentils slow-cooked overnight with fresh cream, butter, and tomatoes.",
    type: "veg",
    isChefRecommendation: true,
  },
  {
    id: "kadai-subz",
    category: "north-indian",
    name: "Kadai Subz",
    price: "INR 260",
    priceValue: 260,
    description: "Assorted seasonal vegetables tossed in fresh kadai spices with capsicum chunks.",
    type: "veg",
  },
  {
    id: "butter-naan",
    category: "breads",
    name: "Butter Naan",
    price: "INR 70",
    priceValue: 70,
    description: "Clay-oven baked white flour flatbread glazed with premium fresh butter.",
    type: "veg",
  },
  {
    id: "tandoori-roti",
    category: "breads",
    name: "Tandoori Roti",
    price: "INR 40",
    priceValue: 40,
    description: "Simple, healthy whole wheat flatbread direct from the clay tandoor sides.",
    type: "veg",
  },
];
