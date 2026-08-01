"use client";

import * as React from "react";
import Image from "next/image";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
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
  QrCode,
  ShieldCheck,
  AlertTriangle,
  CheckCircle2,
  Lock
} from "lucide-react";
import { useMenu } from "@/components/menu/useMenu";
import { MenuGrid } from "@/components/menu/MenuGrid";
import { MenuSidebar } from "@/components/menu/MenuSidebar";
import { MenuSearch } from "@/components/menu/MenuSearch";
import { MenuFilters } from "@/components/menu/MenuFilters";
import { MenuCard } from "@/components/menu/MenuCard";
import { usePathname } from "next/navigation";
import { MENU_ITEMS } from "@/data/menu";
import { ToastNotification, ToastItem } from "@/shared/components/molecules/ToastNotification";
import { useTableSession } from "@/hooks/useTableSession";
import { TableVerificationBanner } from "./TableVerificationBanner";
import { QrInstructionModal } from "./QrInstructionModal";
import { createOrderAction } from "@/actions/order-actions";
import { buildFormattedWhatsAppMessage, OFFICIAL_HOTEL_WHATSAPP } from "@/lib/whatsapp";
import { cn } from "@/lib/utils";

export function MenuContainer() {
  const [loading, setLoading] = React.useState(true);
  const menu = useMenu();
  const pathname = usePathname();

  // QR Table Session Hook
  const {
    isVerifying,
    isVerified,
    tableNumber,
    token: sessionToken,
    expiresAt,
  } = useTableSession();

  // Toast notification state
  const [toast, setToast] = React.useState<ToastItem | null>(null);

  // QR Instruction Modal state
  const [isQrModalOpen, setIsQrModalOpen] = React.useState<boolean>(false);

  // Order state
  const [isPlacingOrder, setIsPlacingOrder] = React.useState<boolean>(false);
  const [orderError, setOrderError] = React.useState<string | null>(null);
  const [confirmedOrder, setConfirmedOrder] = React.useState<any | null>(null);

  // Featured Curations Tab Selection
  const [featuredTab, setFeaturedTab] = React.useState<"signature" | "popular" | "new">("signature");

  // Parallax animation hooks
  const { scrollY } = useScroll();
  const videoY = useTransform(scrollY, [0, 600], [0, 150]);
  const textY = useTransform(scrollY, [0, 600], [0, -60]);
  const textOpacity = useTransform(scrollY, [0, 450], [1, 0]);

  // Preloader
  React.useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 600);
    return () => clearTimeout(timer);
  }, []);

  const handleAddToCart = React.useCallback((item: any, variant?: any) => {
    menu.addToCart(item, variant);
    setToast({
      id: Date.now().toString(),
      itemName: item.name,
      price: variant ? variant.price : item.price,
    });
  }, [menu]);

  // Handle Order on WhatsApp with PostgreSQL persistence
  const handleOrderOnWhatsApp = async () => {
    if (!isVerified || !tableNumber || !sessionToken) {
      setIsQrModalOpen(true);
      return;
    }

    if (menu.cart.length === 0) {
      setOrderError("Your cart is empty. Please add items before placing an order.");
      return;
    }

    setIsPlacingOrder(true);
    setOrderError(null);

    try {
      // 1. Save Order into PostgreSQL via Server Action with Prisma Transaction
      const orderPayload = {
        tableNumber,
        token: sessionToken,
        items: menu.cart.map(({ item, quantity, selectedVariant }) => ({
          menuItemId: item.id,
          quantity,
          price: selectedVariant ? selectedVariant.price : item.price,
          name: item.name,
          variantLabel: selectedVariant?.label,
        })),
        customerName: "Table Guest",
      };

      const result = await createOrderAction(orderPayload);

      if (!result.success || !result.order) {
        throw new Error(result.error || "Failed to persist order in database.");
      }

      const dbOrder = result.order;
      const totalQty = menu.cart.reduce((sum, i) => sum + i.quantity, 0);

      // 2. Build WhatsApp formatted message matching user specification
      const whatsappMessage = buildFormattedWhatsAppMessage({
        orderId: dbOrder.orderId,
        tableNumber: tableNumber,
        items: menu.cart.map(({ item, quantity, selectedVariant }) => ({
          name: `${item.name}${selectedVariant ? ` (${selectedVariant.label})` : ""}`,
          quantity,
          price: selectedVariant ? selectedVariant.price : item.price,
        })),
        totalQuantity: totalQty,
        totalAmount: dbOrder.grandTotal,
        timeStr: new Date().toLocaleTimeString("en-US", {
          hour: "numeric",
          minute: "2-digit",
          hour12: true,
        }),
      });

      // 3. Open WhatsApp deep link
      const whatsappUrl = `https://wa.me/${OFFICIAL_HOTEL_WHATSAPP}?text=${encodeURIComponent(whatsappMessage)}`;
      window.open(whatsappUrl, "_blank");

      // 4. Set state & clear cart
      setConfirmedOrder(dbOrder);
      menu.clearCart();
      menu.setIsCartOpen(false);
    } catch (err: any) {
      console.error("Order error:", err);
      setOrderError(err.message || "Failed to place order. Please try again.");
    } finally {
      setIsPlacingOrder(false);
    }
  };

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

  const totalCartItems = menu.cart.reduce((sum, i) => sum + i.quantity, 0);

  if (loading) {
    return (
      <div className="fixed inset-0 bg-background z-50 flex flex-col items-center justify-center space-y-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          className="text-center space-y-6"
        >
          <div className="h-20 w-20 border border-[#DFBA73]/25 flex items-center justify-center mx-auto rounded-full bg-[#DFBA73]/[0.02] relative overflow-hidden">
            <span className="font-serif text-[#DFBA73] text-2xl tracking-[0.1em]">YG</span>
            <div className="absolute inset-0 border-t border-[#DFBA73] animate-spin duration-[3000ms]" />
          </div>
          <div className="space-y-2">
            <span className="text-[12px] uppercase tracking-[0.5em] text-[#8A8A8A] block font-sans">
              HOTEL YASH GRAND
            </span>
            <span className="text-[9px] uppercase tracking-[0.3em] text-[#DFBA73] block font-semibold">
              Digital Menu & QR Dining
            </span>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <section className="relative w-full min-h-screen bg-background text-foreground select-none pb-32">
      {/* 1. TABLE VERIFICATION STICKY BAR AT TOP */}
      <div className="sticky top-16 z-40">
        <TableVerificationBanner
          isVerified={isVerified}
          isVerifying={isVerifying}
          tableNumber={tableNumber}
          expiresAt={expiresAt}
          onOpenInstructionModal={() => setIsQrModalOpen(true)}
        />
      </div>

      {/* 2. Cinematic Hero Header */}
      <div className="relative w-full h-[55vh] sm:h-[65vh] bg-black overflow-hidden flex items-center justify-center mb-16">
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

        <div className="absolute inset-0 bg-gradient-to-b from-neutral-950/80 via-transparent to-background z-[1]" />
        <div className="absolute inset-0 bg-neutral-950/30 z-[1]" />

        <motion.div 
          style={{ y: textY, opacity: textOpacity }} 
          className="absolute z-10 text-center space-y-5 max-w-4xl px-6"
        >
          {isVerified && tableNumber ? (
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 text-xs font-bold uppercase tracking-widest mb-2 shadow-lg">
              <ShieldCheck className="h-4 w-4" />
              <span>Dining Verified at Table {tableNumber}</span>
            </div>
          ) : (
            <span className="text-[12px] uppercase tracking-[0.4em] text-gold font-bold block">
              HOTEL YASH GRAND
            </span>
          )}

          <h1 className="font-serif text-4xl sm:text-6xl md:text-7xl font-extralight text-white tracking-wide uppercase leading-tight">
            Digital Ordering <br />
            <span className="italic font-light text-gold font-serif lowercase text-[32px] sm:text-[48px] md:text-[56px]">
              Varanasi Fine Dining
            </span>
          </h1>
          <div className="h-[1px] w-32 bg-gold/30 mx-auto my-4" />
          <p className="text-[10px] sm:text-xs text-neutral-300 font-light tracking-[0.2em] max-w-xl mx-auto uppercase">
            {isVerified ? `Table ${tableNumber} active session — Select items & order on WhatsApp` : "Scan your table QR code to enable instant ordering"}
          </p>
        </motion.div>
      </div>

      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10 space-y-28">
        
        {/* 3. CHEF'S RECOMMENDED SPECIALS */}
        <div className="space-y-12">
          <div className="text-center space-y-3">
            <span className="text-[13px] uppercase tracking-[0.12em] text-[#8A8A8A] font-medium block">HOTEL YASH GRAND</span>
            <h2 className="font-serif text-[32px] sm:text-[48px] md:text-[56px] font-light tracking-wide text-white leading-tight">
              Chef&apos;s Recommended Specials
            </h2>
            <div className="h-[1px] w-16 bg-[#DFBA73]/25 mx-auto mt-4" />
          </div>

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
                      layoutId="activeCuratorTabMenu"
                      className="absolute bottom-[-25px] left-0 right-0 h-[1.5px] bg-[#DFBA73]"
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  )}
                </button>
              );
            })}
          </div>

          <div className="min-h-[460px]">
            <AnimatePresence mode="wait">
              <motion.div
                key={featuredTab}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.5 }}
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

        {/* 4. MAIN DIGITAL MENU EXPLORER */}
        <div className="space-y-16">
          <div className="text-center space-y-3">
            <span className="text-[13px] uppercase tracking-[0.12em] text-[#8A8A8A] font-medium block">HOTEL YASH GRAND</span>
            <h2 className="font-serif text-[32px] sm:text-[48px] md:text-[56px] font-light tracking-wide text-white leading-tight">
              Full Restaurant Menu
            </h2>
            <div className="h-[1px] w-16 bg-[#DFBA73]/25 mx-auto mt-4" />
          </div>

          <div className="space-y-10">
            {/* Search & Filter Bar */}
            <div className="bg-neutral-950/90 backdrop-blur-xl border border-gold/10 p-4 md:p-6 shadow-lux flex flex-col md:flex-row gap-6 justify-between items-center z-20 sticky top-32">
              <MenuSearch value={menu.searchQuery} onChange={menu.setSearchQuery} />

              <div className="flex flex-wrap items-center gap-4 w-full md:w-auto justify-end">
                <MenuFilters activeFilter={menu.filterType} onFilterChange={menu.setFilterType} />

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

            {/* Sidebar & Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
              <MenuSidebar
                categories={menu.categories}
                selectedCategory={menu.selectedCategory}
                onCategoryChange={menu.setSelectedCategory}
                className="lg:col-span-3 lg:sticky lg:top-48"
              />

              <main className="lg:col-span-9">
                <MenuGrid items={menu.processedItems} onAddToBill={handleAddToCart} />
              </main>
            </div>
          </div>
        </div>

      </div>

      {/* 5. FLOATING CART SUMMARY BUTTON */}
      <AnimatePresence>
        {totalCartItems > 0 && !menu.isCartOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            onClick={() => menu.setIsCartOpen(true)}
            className="fixed bottom-6 right-6 z-[90] bg-[#0F1115]/95 border border-[#C5A880]/50 p-4 rounded-2xl shadow-lux backdrop-blur-xl flex items-center gap-4 text-white cursor-pointer group hover:border-[#C5A880] transition-all min-h-[56px] select-none"
          >
            <div className="relative flex items-center justify-center h-11 w-11 rounded-full bg-[#C5A880] text-black shrink-0 font-bold group-hover:scale-105 transition-transform">
              <ShoppingBag className="h-5 w-5" />
              <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-black text-[#C5A880] text-[10px] font-mono font-bold flex items-center justify-center border border-[#C5A880]/50">
                {totalCartItems}
              </span>
            </div>

            <div className="space-y-0.5">
              <div className="text-xs text-neutral-300 font-sans font-medium">
                {totalCartItems} Items Selected {isVerified && `• Table ${tableNumber}`}
              </div>
              <div className="font-mono text-sm font-bold text-[#C5A880]">
                ₹{menu.cartTotal}
              </div>
            </div>

            <button
              type="button"
              className={cn(
                "ml-2 px-4 py-2.5 font-bold text-xs uppercase tracking-wider rounded-sm transition-colors cursor-pointer shrink-0 hidden sm:flex items-center gap-1.5 min-h-[38px]",
                isVerified 
                  ? "bg-[#25D366] hover:bg-[#1DA851] text-black" 
                  : "bg-amber-500 hover:bg-amber-400 text-black"
              )}
            >
              <span>{isVerified ? "Order on WhatsApp →" : "View Cart"}</span>
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 6. SIDE CART DRAWER WITH STRICT VERIFICATION CHECKOUT */}
      <AnimatePresence>
        {menu.isCartOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => menu.setIsCartOpen(false)}
              className="fixed inset-0 z-40 bg-black/75 backdrop-blur-sm"
            />

            <motion.aside
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="fixed top-0 right-0 bottom-0 z-50 w-[90%] sm:w-[460px] bg-neutral-950 border-l border-gold/15 p-6 sm:p-8 flex flex-col justify-between shadow-lux"
            >
              {/* Cart Drawer Header */}
              <div className="flex justify-between items-center border-b border-gold/15 pb-4">
                <div className="space-y-1">
                  <h3 className="font-serif text-xl tracking-wide text-white flex items-center gap-2">
                    <span>Your Order</span>
                    {isVerified && tableNumber && (
                      <span className="text-xs font-sans bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 px-2.5 py-0.5 rounded-full font-bold">
                        Table {tableNumber}
                      </span>
                    )}
                  </h3>
                  <p className="text-[9px] uppercase tracking-widest text-neutral-400">
                    {isVerified ? "QR Table Session Active" : "Ordering Disabled — Verification Required"}
                  </p>
                </div>
                <button 
                  onClick={() => menu.setIsCartOpen(false)}
                  className="p-2 border border-gold/15 hover:border-[#DFBA73] transition-colors text-[#8A8A8A] hover:text-[#DFBA73] cursor-pointer"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {/* Order Error Notification */}
              {orderError && (
                <div className="my-3 p-3 bg-red-950/80 border border-red-500/30 text-red-200 text-xs rounded-sm">
                  {orderError}
                </div>
              )}

              {/* Items List */}
              <div className="flex-1 overflow-y-auto py-6 space-y-4 scrollbar-none">
                {menu.cart.length > 0 ? (
                  menu.cart.map(({ item, quantity, selectedVariant }) => {
                    const displayPrice = selectedVariant ? `₹${selectedVariant.price}` : (item.displayPrice || `₹${item.price}`);
                    const key = selectedVariant ? `cart-${item.id}-${selectedVariant.label}` : `cart-${item.id}`;
                    return (
                      <div key={key} className="flex items-center justify-between gap-4 border-b border-gold/10 pb-4">
                        <div className="space-y-1 flex-1">
                          <span className="text-[8px] uppercase tracking-widest text-[#DFBA73] font-bold">{item.category}</span>
                          <h4 className="font-serif text-sm text-white">
                            {item.name} {selectedVariant && <span className="text-neutral-400 text-xs font-sans">({selectedVariant.label})</span>}
                          </h4>
                          <span className="font-mono text-xs text-[#DFBA73]">
                            {displayPrice}
                          </span>
                        </div>
                        
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
                    <span className="text-4xl">🍽️</span>
                    <p className="text-xs text-[#8A8A8A]">Your cart is empty.</p>
                  </div>
                )}
              </div>

              {/* Receipt Summary & Verification-Enforced Actions */}
              {menu.cart.length > 0 && (
                <div className="border-t border-gold/15 pt-6 space-y-5">
                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between text-neutral-400">
                      <span>Subtotal</span>
                      <span className="font-mono">₹{menu.cartTotal}</span>
                    </div>
                    <div className="flex justify-between text-neutral-400">
                      <span>GST (5%)</span>
                      <span className="font-mono">₹{Math.round(menu.cartTotal * 0.05)}</span>
                    </div>
                    <div className="h-[1px] bg-gold/10 my-2" />
                    <div className="flex justify-between text-sm text-[#DFBA73] font-bold">
                      <span>Grand Total</span>
                      <span className="font-mono">₹{Math.round(menu.cartTotal * 1.05)}</span>
                    </div>
                  </div>

                  {/* VERIFIED VS UNVERIFIED ORDER BUTTON */}
                  {isVerified && tableNumber ? (
                    <button
                      onClick={handleOrderOnWhatsApp}
                      disabled={isPlacingOrder}
                      className="w-full py-4 bg-[#25D366] hover:bg-[#1DA851] text-black font-bold text-xs uppercase tracking-widest transition-all rounded-sm shadow-lux flex items-center justify-center gap-2.5 cursor-pointer disabled:opacity-50 min-h-[48px]"
                    >
                      <Send className="h-4 w-4" />
                      <span>{isPlacingOrder ? "Saving Order in PostgreSQL..." : "Order on WhatsApp →"}</span>
                    </button>
                  ) : (
                    <div className="space-y-3">
                      <div className="bg-amber-950/60 border border-amber-500/30 p-3 rounded text-center space-y-1.5">
                        <div className="text-amber-300 text-xs font-bold flex items-center justify-center gap-1.5">
                          <Lock className="h-3.5 w-3.5" />
                          <span>Ordering Disabled</span>
                        </div>
                        <p className="text-[11px] text-amber-200/90 leading-relaxed font-sans">
                          Please scan the QR code on your restaurant table to place an order.
                        </p>
                      </div>

                      <button
                        onClick={() => {
                          menu.setIsCartOpen(false);
                          setIsQrModalOpen(true);
                        }}
                        className="w-full py-3.5 bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs uppercase tracking-widest transition-all rounded-sm shadow-md flex items-center justify-center gap-2 cursor-pointer min-h-[44px]"
                      >
                        <QrCode className="h-4 w-4" />
                        <span>I am dining at the restaurant</span>
                      </button>
                    </div>
                  )}
                </div>
              )}
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* 7. CONFIRMED ORDER SUCCESS POPUP */}
      <AnimatePresence>
        {confirmedOrder && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[120] bg-black/90 backdrop-blur-md flex items-center justify-center p-6"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-neutral-950 border border-[#DFBA73]/30 p-8 sm:p-10 max-w-md w-full text-center space-y-6 shadow-lux"
            >
              <div className="h-16 w-16 bg-emerald-500/10 rounded-full border border-emerald-500/30 flex items-center justify-center mx-auto text-emerald-400">
                <CheckCircle2 className="h-8 w-8" />
              </div>
              <div className="space-y-2">
                <span className="text-[10px] uppercase tracking-[0.3em] text-[#DFBA73] font-bold block">
                  ORDER SAVED IN DATABASE
                </span>
                <h4 className="font-serif text-2xl text-white">
                  Order ID #{confirmedOrder.orderId}
                </h4>
                <p className="text-xs text-neutral-300 leading-relaxed font-sans">
                  Your order for Table <strong className="text-[#DFBA73]">Table {confirmedOrder.tableNumber}</strong> has been created in PostgreSQL and dispatched to WhatsApp.
                </p>
              </div>

              <div className="bg-neutral-900 border border-white/10 p-4 rounded-lg text-xs font-mono space-y-1 text-neutral-300 text-left">
                <div className="flex justify-between">
                  <span>Order ID:</span>
                  <span className="text-white font-bold">#{confirmedOrder.orderId}</span>
                </div>
                <div className="flex justify-between">
                  <span>Table Number:</span>
                  <span className="text-[#DFBA73] font-bold">{confirmedOrder.tableNumber}</span>
                </div>
                <div className="flex justify-between">
                  <span>Total Amount:</span>
                  <span className="text-emerald-400 font-bold">₹{confirmedOrder.grandTotal}</span>
                </div>
              </div>

              <button
                onClick={() => setConfirmedOrder(null)}
                className="w-full py-3.5 bg-[#DFBA73] hover:bg-[#c5a880] text-black font-bold text-xs uppercase tracking-widest transition-all rounded-sm cursor-pointer"
              >
                Done
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 8. QR INSTRUCTION MODAL */}
      <QrInstructionModal
        isOpen={isQrModalOpen}
        onClose={() => setIsQrModalOpen(false)}
      />

      {/* 9. TOAST NOTIFICATION */}
      <ToastNotification toast={toast} onDismiss={() => setToast(null)} />
    </section>
  );
}
