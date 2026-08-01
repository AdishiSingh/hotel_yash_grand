import { useState, useMemo, useEffect } from "react";
import { MenuItem, MENU_ITEMS } from "@/data/menu";

export type { MenuItem };

export type FilterType = "all" | "veg" | "non-veg" | "beverages" | "popular" | "special";
export type SortOption = "default" | "price-asc" | "price-desc" | "alphabetical";

export interface CategoryInfo {
  id: string;
  label: string;
  icon: string;
  count: number;
}

export interface CartItem {
  item: MenuItem;
  quantity: number;
  selectedVariant?: { label: string; price: number };
}

const CATEGORY_ICONS: Record<string, string> = {
  "soup": "🥣",
  "starters & appetizers": "🥢",
  "starter (chinese)": "🥢",
  "rice & noodles": "🍜",
  "main course": "🍛",
  "main course (veg & non-veg)": "🍛",
  "dal": "🍲",
  "rice & biryani": "🍚",
  "tandoori bread": "🫓",
  "south indian": "🥞",
  "beverages": "🥤",
  "sweets & desserts": "🍰",
};

export const getFallbackDescription = (item: MenuItem): string => {
  if (item.description && item.description.trim()) {
    return item.description;
  }
  const categoryName = item.category.toLowerCase();
  return `A delicious, freshly prepared ${item.name} from our authentic ${categoryName} selection, crafted to perfection with premium ingredients.`;
};

export function useMenu() {
  const [menuItems, setMenuItems] = useState<MenuItem[]>(MENU_ITEMS);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [filterType, setFilterType] = useState<FilterType>("all");
  const [sortBy, setSortBy] = useState<SortOption>("default");

  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [orderStatus, setOrderStatus] = useState<"kot" | "bill" | null>(null);

  // Fetch real menu items from API and merge with master MENU_ITEMS catalog
  useEffect(() => {
    async function fetchMenu() {
      try {
        setLoading(true);
        const res = await fetch("/api/menu");
        const json = await res.json();
        if (json.success && Array.isArray(json.data) && json.data.length > 0) {
          const dbItems: MenuItem[] = json.data.map((item: any) => ({
            id: item.id,
            name: item.name,
            slug: item.name.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
            category: item.category?.name || "Main Course",
            price: item.price,
            type: (item.type || "veg").toLowerCase().includes("non") ? "non-veg" : "veg",
            description: item.description || "",
            image: item.image || "",
            available: item.isAvailable !== undefined ? item.isAvailable : true,
            featured: item.isChefSpecial || item.isBestSeller || false,
            preparationTime: item.preparationTime || "15-20 mins",
          }));

          const dbItemNames = new Set(dbItems.map((i) => i.name.toLowerCase()));
          const remainingStaticItems = MENU_ITEMS.filter((i) => !dbItemNames.has(i.name.toLowerCase()));
          setMenuItems([...dbItems, ...remainingStaticItems]);
        }
      } catch (err: any) {
        console.error("Failed to fetch menu from API:", err);
        setError("Failed to load menu items");
      } finally {
        setLoading(false);
      }
    }
    fetchMenu();
  }, []);

  const categories = useMemo((): CategoryInfo[] => {
    const counts: Record<string, number> = {};
    let totalCount = 0;

    menuItems.forEach((item) => {
      if (item.available) {
        counts[item.category] = (counts[item.category] || 0) + 1;
        totalCount++;
      }
    });

    const list: CategoryInfo[] = Object.keys(counts).map((catName) => ({
      id: catName,
      label: catName,
      icon: CATEGORY_ICONS[catName.toLowerCase()] || "🍽️",
      count: counts[catName],
    }));

    return [
      { id: "all", label: "All Items", icon: "🍽️", count: totalCount },
      ...list,
    ];
  }, [menuItems]);

  const processedItems = useMemo((): MenuItem[] => {
    return menuItems
      .filter((item) => {
        if (!item.available) return false;

        const matchesCategory =
          selectedCategory === "all" || item.category === selectedCategory;

        let matchesFilter = true;
        if (filterType === "veg") {
          matchesFilter = item.type === "veg";
        } else if (filterType === "non-veg") {
          matchesFilter = item.type === "non-veg";
        } else if (filterType === "beverages") {
          matchesFilter = item.category.toLowerCase().includes("beverage");
        } else if (filterType === "popular") {
          matchesFilter = item.featured;
        } else if (filterType === "special") {
          matchesFilter = item.featured && item.price > 200;
        }

        const cleanQuery = searchQuery.trim().toLowerCase();
        const matchesSearch =
          !cleanQuery ||
          item.name.toLowerCase().includes(cleanQuery) ||
          item.category.toLowerCase().includes(cleanQuery) ||
          (item.description && item.description.toLowerCase().includes(cleanQuery));

        return matchesCategory && matchesFilter && matchesSearch;
      })
      .sort((a, b) => {
        if (sortBy === "price-asc") return a.price - b.price;
        if (sortBy === "price-desc") return b.price - a.price;
        if (sortBy === "alphabetical") return a.name.localeCompare(b.name);
        return 0;
      });
  }, [menuItems, selectedCategory, filterType, searchQuery, sortBy]);

  const addToCart = (item: MenuItem, variant?: { label: string; price: number }) => {
    setCart((prev) => {
      const existingIndex = prev.findIndex(
        (i) =>
          i.item.id === item.id &&
          (!variant || i.selectedVariant?.label === variant.label)
      );

      if (existingIndex > -1) {
        const nextCart = [...prev];
        nextCart[existingIndex].quantity += 1;
        return nextCart;
      }

      return [...prev, { item, quantity: 1, selectedVariant: variant }];
    });
  };

  const updateQuantity = (itemId: string, delta: number, variantLabel?: string) => {
    setCart((prev) =>
      prev
        .map((i) =>
          i.item.id === itemId && i.selectedVariant?.label === variantLabel
            ? { ...i, quantity: i.quantity + delta }
            : i
        )
        .filter((i) => i.quantity > 0)
    );
  };

  const removeFromCart = (itemId: string, variantLabel?: string) => {
    setCart((prev) =>
      prev.filter(
        (i) => !(i.item.id === itemId && i.selectedVariant?.label === variantLabel)
      )
    );
  };

  const clearCart = () => setCart([]);

  const processKOT = async () => {
    setOrderStatus("kot");
    try {
      await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tableNumber: "T-01",
          customerName: "Dine-In Guest",
          items: cart.map((c) => ({
            menuItemId: c.item.id,
            itemName: c.item.name,
            quantity: c.quantity,
            price: c.selectedVariant ? c.selectedVariant.price : c.item.price,
          })),
        }),
      });
    } catch (err) {
      console.error("Failed to post order to API:", err);
    } finally {
      setTimeout(() => {
        setOrderStatus(null);
        clearCart();
        setIsCartOpen(false);
      }, 1500);
    }
  };

  const requestBill = async () => {
    setOrderStatus("bill");
    try {
      await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tableNumber: "T-01",
          customerName: "Dine-In Guest",
          items: cart.map((c) => ({
            menuItemId: c.item.id,
            itemName: c.item.name,
            quantity: c.quantity,
            price: c.selectedVariant ? c.selectedVariant.price : c.item.price,
          })),
        }),
      });
    } catch (err) {
      console.error("Failed to post bill order to API:", err);
    } finally {
      setTimeout(() => {
        setOrderStatus(null);
        clearCart();
        setIsCartOpen(false);
      }, 1500);
    }
  };

  const cartTotal = useMemo(() => {
    return cart.reduce((sum, curr) => {
      const price = curr.selectedVariant ? curr.selectedVariant.price : curr.item.price;
      return sum + price * curr.quantity;
    }, 0);
  }, [cart]);

  const cartTax = useMemo(() => parseFloat((cartTotal * 0.05).toFixed(2)), [cartTotal]);
  const cartGrandTotal = cartTotal + cartTax;

  return {
    loading,
    error,
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    filterType,
    setFilterType,
    sortBy,
    setSortBy,
    processedItems,
    categories,
    cart,
    isCartOpen,
    setIsCartOpen,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    cartTotal,
    cartTax,
    cartGrandTotal,
    orderStatus,
    processKOT,
    requestBill,
  };
}
