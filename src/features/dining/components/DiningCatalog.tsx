"use client";

import * as React from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ASSET_MANIFEST } from "@/shared/lib/asset-manifest";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import { useBookingGuard } from "@/context/BookingGuardContext";
import { 
  ShoppingBag, 
  X, 
  Check, 
  Plus, 
  Minus, 
  Trash2,
  Clock,
  ArrowRight,
  Send,
  QrCode
} from "lucide-react";

// Import modular Menu components
import { useMenu } from "@/components/menu/useMenu";
import { MenuGrid } from "@/components/menu/MenuGrid";
import { MenuSidebar } from "@/components/menu/MenuSidebar";
import { MenuSearch } from "@/components/menu/MenuSearch";
import { MenuFilters } from "@/components/menu/MenuFilters";
import { MenuCard } from "@/components/menu/MenuCard";
import { usePathname } from "next/navigation";
import { MENU_ITEMS } from "@/data/menu";
import { DineInOrderModal } from "./DineInOrderModal";
import { ToastNotification, ToastItem } from "@/shared/components/molecules/ToastNotification";

export function DiningCatalog() {
  const [loading, setLoading] = React.useState(true);
  const menu = useMenu();
  const pathname = usePathname();
  const { requireAuth } = useBookingGuard();

  // Toast notification state
  const [toast, setToast] = React.useState<ToastItem | null>(null);

  const handleAddToCart = React.useCallback((item: any, variant?: any) => {
    menu.addToCart(item, variant);
    setToast({
      id: Date.now().toString(),
      itemName: item.name,
      price: variant ? variant.price : item.price,
    });
  }, [menu]);

  // Dine-In Table Number & WhatsApp Ordering Modal state
  const [tableParam, setTableParam] = React.useState<string>("");
  const [isDineInModalOpen, setIsDineInModalOpen] = React.useState<boolean>(false);

  // Condition to show floating cart summary ONLY during active menu browsing
  const isCartFloatingVisible = 
    menu.cart.length > 0 && 
    !menu.isCartOpen && 
    !isDineInModalOpen && 
    pathname !== "/cart" && 
    pathname !== "/checkout" && 
    pathname !== "/billing" && 
    pathname !== "/bookings";

  // Detect QR Table Number query parameter on mount
  React.useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const table = params.get("table");
      if (table && table.trim()) {
        const formatted = table.toUpperCase().startsWith("T-") 
          ? table.toUpperCase() 
          : `T-${table.toUpperCase().padStart(2, "0")}`;
        setTableParam(formatted);
        localStorage.setItem("yash_table_number", formatted);
      } else {
        const saved = localStorage.getItem("yash_table_number");
        if (saved) setTableParam(saved);
      }
    }
  }, []);

  // Featured Curations Tab Selection
  const [featuredTab, setFeaturedTab] = React.useState<"signature" | "popular" | "new">("signature");

  // Reservation details state
  const [reservationName, setReservationName] = React.useState("");

  // Smooth Scroll Parallax hooks
  const { scrollY } = useScroll();
  const videoY = useTransform(scrollY, [0, 600], [0, 150]);
  const textY = useTransform(scrollY, [0, 600], [0, -60]);
  const textOpacity = useTransform(scrollY, [0, 450], [1, 0]);

  // Smooth pre-loader
  React.useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  // Filter items for the Chef's Curations section (keeps featured signature dishes)
  const featuredItems = React.useMemo(() => {
    switch (featuredTab) {
      case "signature":
        return MENU_ITEMS.filter((item) => item.featured).slice(0, 3);
      case "popular":
        return MENU_ITEMS.filter((item) => item.price > 220).slice(0, 3);
      case "new":
        return MENU_ITEMS.filter((item) => item.id.includes("-15") || item.id.includes("-18") || item.id.includes("-60")).slice(0, 3);
    }
  }, [featuredTab]);

  const handleReservation = (e: React.FormEvent) => {
    e.preventDefault();
    requireAuth((customer) => {
      const message = `Hello, I'd like to reserve a table under the name ${reservationName || customer.name} for a dining session at HOTEL YASH GRAND.`;
      const whatsappUrl = `https://wa.me/919151088115?text=${encodeURIComponent(message)}`;
      window.open(whatsappUrl, "_blank");
      setReservationName("");
    }, { reservationName });
  };

  // Render Loader
  if (loading) {
    return (
      <div className="fixed inset-0 bg-background z-50 flex flex-col items-center justify-center space-y-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="text-center space-y-6"
        >
          {/* Logo Monogram */}
          <div className="h-20 w-20 border border-[#DFBA73]/25 flex items-center justify-center mx-auto rounded-full bg-[#DFBA73]/[0.02] shadow-lux relative overflow-hidden">
            <span className="font-serif text-[#DFBA73] text-2xl tracking-[0.1em]">YG</span>
            <div className="absolute inset-0 border-t border-[#DFBA73] animate-spin duration-[3000ms]" />
          </div>
          <div className="space-y-2">
            <span className="text-[12px] uppercase tracking-[0.5em] text-[#8A8A8A] block font-sans">
              HOTEL YASH GRAND
            </span>
            <span className="text-[9px] uppercase tracking-[0.3em] text-[#DFBA73] block font-semibold">
              Restaurant & Banquet Varanasi
            </span>
          </div>
          <div className="h-[1px] w-16 bg-gold/20 mx-auto" />
        </motion.div>
      </div>
    );
  }

  return (
    <section className="relative w-full min-h-screen bg-background text-foreground select-none pb-32">
      {/* Editorial subtle grid mesh background */}
      <div className="absolute inset-0 bg-grid-mesh pointer-events-none opacity-10" />

      {/* 1. Cinematic Hero Header with Parallax */}
      <div className="relative w-full h-[65vh] bg-black overflow-hidden flex items-center justify-center mb-24">
        <motion.div style={{ y: videoY }} className="absolute inset-0 w-full h-full">
          <video
            autoPlay
            muted
            loop
            playsInline
            className="w-full h-full object-cover opacity-50 scale-105"
            preload="auto"
          >
            <source src="/assets/restaurant/WhatsApp Video 2026-07-11 at 11.26.30.mp4" type="video/mp4" />
          </video>
        </motion.div>
        {/* Soft luxury linear overlays */}
        <div className="absolute inset-0 bg-gradient-to-b from-neutral-950/80 via-transparent to-background z-[1]" />
        <div className="absolute inset-0 bg-neutral-950/30 z-[1]" />

        <motion.div 
          style={{ y: textY, opacity: textOpacity }} 
          className="absolute z-10 text-center space-y-6 max-w-4xl px-6"
        >
          <span className="text-[12px] uppercase tracking-[0.4em] text-gold font-bold block">
            HOTEL YASH GRAND
          </span>
          <h1 className="font-serif text-5xl sm:text-7xl font-extralight text-white tracking-wide uppercase leading-tight">
            Restaurant & Banquet <br />
            <span className="italic font-light text-gold font-serif lowercase text-[36px] sm:text-[48px] md:text-[56px]">Varanasi</span>
          </h1>
          <div className="h-[1px] w-32 bg-gold/30 mx-auto my-6" />
          <p className="text-[10px] sm:text-xs text-neutral-300 font-light tracking-[0.2em] max-w-xl mx-auto uppercase">
            Explore our royal culinary collection
          </p>
        </motion.div>
      </div>

      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10 space-y-36">
        
        {/* 2. CHEF'S CURATIONS (Featured Tab Section) */}
        <div className="space-y-16">
          <div className="text-center space-y-3">
            <span className="text-[13px] uppercase tracking-[0.12em] text-[#8A8A8A] font-medium block">HOTEL YASH GRAND</span>
            <h2 className="font-serif text-[36px] sm:text-[48px] md:text-[56px] lg:text-[64px] font-light tracking-wide text-white leading-tight">Chef&apos;s Recommended Specials</h2>
            <div className="h-[1px] w-16 bg-[#DFBA73]/25 mx-auto mt-4" />
          </div>

          {/* Luxury Curated Tab Switcher */}
          <div className="flex justify-center items-center gap-2 md:gap-6 flex-wrap border-b border-gold/10 pb-6 max-w-3xl mx-auto">
            {([
              { id: "signature", label: "Chef's Signatures" },
              { id: "popular", label: "Most Popular" },
              { id: "new", label: "New Arrivals" }
            ] as const).map((tab) => {
              const isActive = featuredTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setFeaturedTab(tab.id)}
                  className={cn(
                    "flex items-center gap-2 px-4 py-2.5 text-xs uppercase tracking-widest font-semibold transition-all duration-300 cursor-pointer relative",
                    isActive ? "text-white font-bold" : "text-neutral-500 hover:text-neutral-200"
                  )}
                >
                  <span>{tab.label}</span>
                  {isActive && (
                    <motion.div
                      layoutId="activeCuratorTab"
                      className="absolute bottom-[-25px] left-0 right-0 h-[1.5px] bg-[#DFBA73]"
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  )}
                </button>
              );
            })}
          </div>

          {/* Curated Grid Display */}
          <div className="min-h-[480px]">
            <AnimatePresence mode="wait">
              <motion.div
                key={featuredTab}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                className="grid grid-cols-1 md:grid-cols-3 gap-10"
              >
                {featuredItems.map((item) => (
                  <MenuCard
                    key={`featured-${item.id}`}
                    item={item}
                    onAddToBill={handleAddToCart}
                  />
                ))}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* 3. MENU EXPLORER (The Main Digital Menu) */}
        <div className="space-y-16">
          <div className="text-center space-y-3">
            <span className="text-[13px] uppercase tracking-[0.12em] text-[#8A8A8A] font-medium block">HOTEL YASH GRAND</span>
            <h2 className="font-serif text-[36px] sm:text-[48px] md:text-[56px] lg:text-[64px] font-light tracking-wide text-white leading-tight">Explore Our Menu</h2>
            <div className="h-[1px] w-16 bg-[#DFBA73]/25 mx-auto mt-4" />
          </div>

          <div className="space-y-10">
            {/* Premium Glassmorphic Search & Filter Bar */}
            <div className="bg-neutral-950/80 backdrop-blur-xl border border-gold/10 p-4 md:p-6 shadow-[0_15px_40px_rgba(197,168,128,0.01)] flex flex-col md:flex-row gap-6 justify-between items-center z-20 sticky top-20">
              
              {/* Elegant Search Panel */}
              <MenuSearch value={menu.searchQuery} onChange={menu.setSearchQuery} />

              {/* Filters Controllers */}
              <div className="flex flex-wrap items-center gap-4 w-full md:w-auto justify-end">
                <MenuFilters activeFilter={menu.filterType} onFilterChange={menu.setFilterType} />

                {/* Sorting Selector */}
                <select
                  value={menu.sortBy}
                  onChange={(e) => menu.setSortBy(e.target.value as any)}
                  className="bg-transparent border border-gold/15 rounded-full py-2 px-4 text-xs uppercase tracking-widest font-semibold focus:outline-none focus:border-[#DFBA73] cursor-pointer text-white"
                >
                  <option value="default" className="bg-[#121212] text-white">Menu Order</option>
                  <option value="price-asc" className="bg-[#121212] text-white">Price Low → High</option>
                  <option value="price-desc" className="bg-[#121212] text-white">Price High → Low</option>
                  <option value="alphabetical" className="bg-[#121212] text-white">Alphabetical</option>
                </select>
              </div>
            </div>

            {/* Sidebar & Grid Arrangement */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
              
              {/* Category Navigation (Horizontal Chips on Mobile, Left Sidebar on Desktop) */}
              <MenuSidebar
                categories={menu.categories}
                selectedCategory={menu.selectedCategory}
                onCategoryChange={menu.setSelectedCategory}
                className="lg:col-span-3 lg:sticky lg:top-32"
              />

              {/* Main Items View (Right Grid) */}
              <main className="lg:col-span-9">
                <MenuGrid items={menu.processedItems} onAddToBill={handleAddToCart} />
              </main>
            </div>
          </div>
        </div>

        {/* 4. TABLE RESERVATIONS FORM */}
        <div className="border border-gold/10 bg-neutral-900/40 backdrop-blur-md p-8 sm:p-16 max-w-4xl mx-auto shadow-lux">
          <div className="text-center space-y-4 mb-12">
            <span className="text-[13px] uppercase tracking-[0.12em] text-[#8A8A8A] font-medium block">
              HOTEL YASH GRAND
            </span>
            <h3 className="font-serif text-[36px] sm:text-[48px] md:text-[56px] lg:text-[64px] font-light text-white leading-tight">
              Restaurant & Banquet Reservations
            </h3>
          </div>

          <form onSubmit={handleReservation} className="grid grid-cols-1 sm:grid-cols-2 gap-8">
            <div className="relative">
              <label className="text-[13px] uppercase tracking-[0.12em] text-[#8A8A8A] block mb-1">
                Guest Name
              </label>
              <input
                type="text"
                className="w-full bg-transparent border-b border-gold/15 py-2.5 focus:outline-none focus:border-[#DFBA73] transition-colors text-sm text-white"
                value={reservationName}
                onChange={(e) => setReservationName(e.target.value)}
                placeholder="Rakesh Sharma"
                required
              />
            </div>
            
            <div className="relative">
              <label className="text-[13px] uppercase tracking-[0.12em] text-[#8A8A8A] block mb-1">
                Dining Session
              </label>
              <select className="w-full bg-transparent border-b border-gold/15 py-2.5 focus:outline-none focus:border-[#DFBA73] transition-colors text-sm cursor-pointer text-white">
                <option value="lunch" className="bg-[#121212] text-white">Lunch (12:00 PM - 3:30 PM)</option>
                <option value="dinner" className="bg-[#121212] text-white">Dinner (7:00 PM - 11:30 PM)</option>
              </select>
            </div>

            <div className="sm:col-span-2 pt-6">
              <Button type="submit" variant="primary" size="lg" className="w-full text-xs uppercase tracking-widest font-bold py-4 bg-[#DFBA73] hover:bg-[#c5a880] text-black hover:text-black transition-all duration-300 border-none cursor-pointer rounded-sm shadow-md">
                Inquire Seating via WhatsApp
              </Button>
            </div>
          </form>
        </div>

      </div>

      {/* 5. LUXURY FLOATING CART SUMMARY BAR (BOTTOM-RIGHT) */}
      <AnimatePresence>
        {isCartFloatingVisible && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
            onClick={() => menu.setIsCartOpen(true)}
            className="fixed bottom-6 right-6 z-[95] bg-[#0F1115]/95 border border-[#C5A880]/50 p-3 sm:p-4 rounded-2xl shadow-lux backdrop-blur-xl flex items-center gap-4 text-white cursor-pointer group hover:border-[#C5A880] transition-all min-h-[52px] select-none"
          >
            <div className="relative flex items-center justify-center h-10 w-10 rounded-full bg-[#C5A880] text-black shrink-0 font-bold group-hover:scale-105 transition-transform">
              <ShoppingBag className="h-5 w-5" />
              <motion.span
                key={menu.cart.reduce((sum, item) => sum + item.quantity, 0)}
                initial={{ scale: 0.5 }}
                animate={{ scale: 1 }}
                className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-black text-[#C5A880] text-[10px] font-mono font-bold flex items-center justify-center border border-[#C5A880]/50"
              >
                {menu.cart.reduce((sum, item) => sum + item.quantity, 0)}
              </motion.span>
            </div>

            <div className="space-y-0.5">
              <div className="text-xs text-neutral-300 font-sans font-medium">
                {menu.cart.reduce((sum, item) => sum + item.quantity, 0)} Items Selected
              </div>
              <div className="font-mono text-sm font-bold text-[#C5A880]">
                ₹{menu.cartTotal}
              </div>
            </div>

            <button
              type="button"
              className="ml-2 px-3.5 py-2 bg-[#C5A880] hover:bg-[#A37C40] text-black font-bold text-[10.5px] uppercase tracking-wider rounded-sm transition-colors cursor-pointer shrink-0 hidden sm:flex items-center gap-1 min-h-[36px]"
            >
              <span>View Cart</span>
              <ArrowRight className="h-3 w-3" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 6. LUXURY SELECTION DRAWER (POS & Cart Preview Panel) */}
      <AnimatePresence>
        {menu.isCartOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => menu.setIsCartOpen(false)}
              className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
            />
            {/* Side Panel */}
            <motion.aside
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="fixed top-0 right-0 bottom-0 z-50 w-[90%] sm:w-[450px] bg-neutral-950 border-l border-gold/15 p-8 flex flex-col justify-between shadow-lux"
            >
              {/* Header */}
              <div className="flex justify-between items-center border-b border-gold/15 pb-4">
                <div className="space-y-1">
                  <h3 className="font-serif text-xl tracking-wide text-white">Your Cart</h3>
                  <p className="text-[8px] uppercase tracking-widest text-neutral-400">Order Summary</p>
                </div>
                <button 
                  onClick={() => menu.setIsCartOpen(false)}
                  className="p-2 border border-gold/15 hover:border-[#DFBA73] transition-colors text-[#8A8A8A] hover:text-[#DFBA73] cursor-pointer"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {/* Items List */}
              <div className="flex-1 overflow-y-auto py-6 space-y-4 scrollbar-none">
                {menu.cart.length > 0 ? (
                  menu.cart.map(({ item, quantity, selectedVariant }) => {
                    const displayPriceValue = selectedVariant ? `₹${selectedVariant.price}` : (item.displayPrice || `₹${item.price}`);
                    const uniqueKey = selectedVariant ? `cart-${item.id}-${selectedVariant.label}` : `cart-${item.id}`;
                    return (
                      <div key={uniqueKey} className="flex items-center justify-between gap-4 border-b border-gold/10 pb-4">
                        <div className="space-y-1 flex-1">
                          <span className="text-[8px] uppercase tracking-widest text-[#DFBA73] font-bold">{item.category}</span>
                          <h4 className="font-serif text-sm text-white">
                            {item.name} {selectedVariant && <span className="text-neutral-400 text-xs font-sans">({selectedVariant.label})</span>}
                          </h4>
                          <span className="font-mono text-xs text-[#DFBA73]">
                            {displayPriceValue}
                          </span>
                        </div>
                        
                        {/* Quantity adjuster */}
                        <div className="flex items-center border border-gold/15 rounded-sm p-0.5 bg-neutral-900">
                          <button 
                            onClick={() => menu.updateQuantity(item.id, -1, selectedVariant?.label)}
                            className="p-1 hover:text-[#DFBA73] transition-colors cursor-pointer text-white"
                          >
                            <Minus className="h-3 w-3" />
                          </button>
                          <span className="px-2 text-xs font-mono font-medium text-white">{quantity}</span>
                          <button 
                            onClick={() => menu.updateQuantity(item.id, 1, selectedVariant?.label)}
                            className="p-1 hover:text-[#DFBA73] transition-colors cursor-pointer text-white"
                          >
                            <Plus className="h-3 w-3" />
                          </button>
                        </div>

                        <button 
                          onClick={() => menu.removeFromCart(item.id, selectedVariant?.label)}
                          className="p-1.5 border border-gold/10 hover:border-red-500/30 text-[#8A8A8A] hover:text-red-400 transition-colors cursor-pointer"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    );
                  })
                ) : (
                  <div className="h-full flex flex-col items-center justify-center text-center space-y-3">
                    <span className="text-3xl">🍽️</span>
                    <p className="text-xs text-[#5E5E5E]">Your cart is empty.</p>
                  </div>
                )}
              </div>

              {/* Receipt Summary & Bill Actions */}
              {menu.cart.length > 0 && (
                <div className="border-t border-gold/15 pt-6 space-y-6">
                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between text-neutral-400">
                      <span>Subtotal</span>
                      <span className="font-mono">₹{menu.cartTotal}</span>
                    </div>
                    <div className="flex justify-between text-neutral-400">
                      <span>GST & Taxes (18%)</span>
                      <span className="font-mono">₹{menu.cartTax}</span>
                    </div>
                    <div className="h-[1px] bg-gold/10 my-2" />
                    <div className="flex justify-between text-sm text-[#DFBA73] font-bold">
                      <span>Grand Total</span>
                      <span className="font-mono">₹{menu.cartGrandTotal}</span>
                    </div>
                  </div>

                  {/* Dine-In WhatsApp Order & POS Actions */}
                  <div className="space-y-3">
                    <button
                      onClick={() => {
                        menu.setIsCartOpen(false);
                        setIsDineInModalOpen(true);
                      }}
                      className="w-full py-4 bg-[#25D366] hover:bg-[#1DA851] text-black font-bold text-xs uppercase tracking-widest transition-all rounded-sm shadow-lux flex items-center justify-center gap-2.5 cursor-pointer min-h-[48px]"
                    >
                      <Send className="h-4 w-4" />
                      <span>Confirm Order via WhatsApp →</span>
                    </button>

                    <div className="flex gap-3">
                      <button
                        onClick={menu.processKOT}
                        className="flex-1 py-3 bg-[#1F1F1F] hover:bg-[#DFBA73] border border-[#DFBA73]/30 hover:border-[#DFBA73] text-white hover:text-black transition-all text-[10px] uppercase tracking-widest font-bold cursor-pointer text-center"
                      >
                        Print KOT
                      </button>
                      <button
                        onClick={menu.requestBill}
                        className="flex-1 py-3 bg-[#1F1F1F] hover:bg-[#DFBA73] border border-[#DFBA73]/30 hover:border-[#DFBA73] text-white hover:text-black transition-all text-[10px] uppercase tracking-widest font-bold cursor-pointer text-center"
                      >
                        Request Bill
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* SUCCESS POPUP ANIMATION OVERLAY */}
      <AnimatePresence>
        {menu.orderStatus && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/85 backdrop-blur-md flex items-center justify-center p-6"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-neutral-950 border border-[#DFBA73]/30 p-10 max-w-md w-full text-center space-y-6 shadow-lux"
            >
              <div className="h-16 w-16 bg-[#DFBA73]/10 rounded-full border border-[#DFBA73]/20 flex items-center justify-center mx-auto text-[#DFBA73]">
                <Check className="h-8 w-8" />
              </div>
              <div className="space-y-2">
                <h4 className="font-serif text-2xl text-white">
                  {menu.orderStatus === "kot" ? "Order Sent to Kitchen" : "Billing Request Raised"}
                </h4>
                <p className="text-xs text-neutral-300 leading-relaxed">
                  {menu.orderStatus === "kot" 
                    ? "Kitchen Order Ticket (KOT) printed successfully. Your gourmet preparation has begun." 
                    : "Your bill receipt is being compiled at the counter. The captain will reach you shortly."}
                </p>
              </div>
              <div className="text-[8px] uppercase tracking-[0.4em] text-[#DFBA73] font-semibold">
                HOTEL YASH GRAND • Restaurant & Banquet • Varanasi
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* QR DINE-IN ORDERING MODAL */}
      <DineInOrderModal
        isOpen={isDineInModalOpen}
        onClose={() => setIsDineInModalOpen(false)}
        cart={menu.cart}
        cartTotal={menu.cartTotal}
        onOrderSuccess={() => {
          menu.clearCart();
        }}
        tableNumberParam={tableParam}
      />

      {/* INSTANT TOAST NOTIFICATION */}
      <ToastNotification toast={toast} onDismiss={() => setToast(null)} />

    </section>
  );
}
