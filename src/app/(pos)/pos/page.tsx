"use client";

import React, { useState, useMemo, useEffect } from "react";
import { Search, Plus, Minus, Trash, Printer, X, Sparkles, CreditCard, DollarSign } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface CartItem {
  id: string;
  name: string;
  price: number;
  qty: number;
  notes?: string;
}

export default function POSPage() {
  const [menuItems, setMenuItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [search, setSearch] = useState("");
  const [activeCat, setActiveCat] = useState("Main Course (Veg & Non-Veg)");
  
  // Customer details
  const [custName, setCustName] = useState("");
  const [custPhone, setCustPhone] = useState("");
  const [tableNum, setTableNum] = useState("Table 01");
  const [orderType, setOrderType] = useState<"dine-in" | "takeaway" | "room-service">("dine-in");
  const [paymentMethod, setPaymentMethod] = useState<"CASH" | "UPI" | "CARD">("UPI");
  const [discount, setDiscount] = useState<number>(0);

  // Completed receipt popup state
  const [completedOrder, setCompletedOrder] = useState<any | null>(null);

  useEffect(() => {
    async function fetchMenu() {
      try {
        setLoading(true);
        const res = await fetch("/api/menu");
        const json = await res.json();
        if (json.success && Array.isArray(json.data)) {
          setMenuItems(json.data);
          if (json.data.length > 0) {
            setActiveCat(json.data[0].category?.name || "Main Course (Veg & Non-Veg)");
          }
        }
      } catch (err) {
        console.error("Failed to fetch POS menu:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchMenu();
  }, []);

  const categories = useMemo(() => {
    const cats = new Set(menuItems.map((i) => i.category?.name || "Main Course"));
    return Array.from(cats);
  }, [menuItems]);

  const filteredItems = useMemo(() => {
    return menuItems.filter((item) => {
      const matchSearch = item.name.toLowerCase().includes(search.toLowerCase());
      const matchCat = (item.category?.name || "Main Course") === activeCat;
      return matchSearch && matchCat;
    });
  }, [menuItems, search, activeCat]);

  // Cart operations
  const addToCart = (item: any) => {
    setCart((prev) => {
      const existing = prev.find((i) => i.id === item.id);
      if (existing) {
        return prev.map((i) => (i.id === item.id ? { ...i, qty: i.qty + 1 } : i));
      }
      return [...prev, { id: item.id, name: item.name, price: item.price, qty: 1 }];
    });
  };

  const updateQty = (id: string, delta: number) => {
    setCart((prev) => {
      return prev
        .map((item) => {
          if (item.id === id) {
            const nextQty = item.qty + delta;
            return { ...item, qty: nextQty };
          }
          return item;
        })
        .filter((item) => item.qty > 0);
    });
  };

  const removeItem = (id: string) => {
    setCart((prev) => prev.filter((i) => i.id !== id));
  };

  // Math calculations
  const subtotal = useMemo(() => {
    return cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  }, [cart]);

  const gstAmt = useMemo(() => {
    return Math.round(subtotal * 0.05 * 100) / 100; // 5% GST
  }, [subtotal]);

  const grandTotal = useMemo(() => {
    return Math.max(0, subtotal + gstAmt - discount);
  }, [subtotal, gstAmt, discount]);

  const handleCheckout = async () => {
    if (cart.length === 0) return;

    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tableNumber: tableNum,
          customerName: custName || "Guest Walk-in",
          customerPhone: custPhone || undefined,
          discount: discount,
          paymentMethod: paymentMethod,
          items: cart.map((c) => ({
            menuItemId: c.id,
            itemName: c.name,
            quantity: c.qty,
            price: c.price,
          })),
        }),
      });

      const json = await res.json();
      if (json.success && json.data) {
        setCompletedOrder({
          id: json.data.bill?.billNumber || json.data.orderId,
          table: tableNum,
          type: orderType,
          customerName: custName || "Guest Walk-in",
          customerPhone: custPhone || "N/A",
          items: cart,
          subtotal,
          gst: gstAmt,
          discount,
          total: grandTotal,
          payment: paymentMethod,
          time: new Date().toLocaleTimeString(),
        });
      }
    } catch (err) {
      console.error("Failed to post order to database API:", err);
    }
  };

  const handlePrint = (e: React.MouseEvent) => {
    e.stopPropagation();
    window.print();
  };

  const clearOrder = () => {
    setCart([]);
    setCustName("");
    setCustPhone("");
    setDiscount(0);
    setCompletedOrder(null);
  };

  return (
    <div className="flex-1 flex overflow-hidden bg-zinc-950 text-white select-none">
      {/* LEFT: Category & Menu Grid */}
      <div className="flex-1 flex flex-col overflow-hidden border-r border-zinc-800">
        {/* Sub Header / Search */}
        <div className="h-14 border-b border-zinc-800 bg-zinc-900/40 px-4 flex items-center justify-between gap-4">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-zinc-500" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Instant dish search..."
              className="w-full bg-zinc-950 border border-zinc-800 focus:border-gold px-9 py-1.5 rounded text-xs text-white placeholder-zinc-600 outline-none transition-all"
            />
          </div>

          <div className="text-[10px] uppercase tracking-widest text-[#DFBA73] font-bold">
            Live Database Menu
          </div>
        </div>

        {/* Categories Sidebar & Grid Wrapper */}
        <div className="flex-1 flex overflow-hidden">
          {/* Categories Sidebar */}
          <div className="w-44 border-r border-zinc-800 bg-zinc-900/20 overflow-y-auto flex flex-col divide-y divide-zinc-900">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCat(cat)}
                className={`w-full text-left px-4 py-3.5 text-[10px] font-bold uppercase tracking-widest transition-colors cursor-pointer ${
                  activeCat === cat ? "bg-[#DFBA73] text-black" : "text-zinc-400 hover:text-white"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Items Grid */}
          <div className="flex-1 p-4 overflow-y-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 items-start">
            {loading ? (
              <div className="col-span-full py-12 text-center text-zinc-500 text-xs font-mono">
                Loading POS menu items from PostgreSQL...
              </div>
            ) : (
              filteredItems.map((item) => (
                <div
                  key={item.id}
                  onClick={() => addToCart(item)}
                  className="p-3 bg-zinc-900/40 border border-zinc-800 hover:border-gold/30 rounded-lg flex flex-col justify-between aspect-[16/11] cursor-pointer transition-all hover:bg-zinc-900/60"
                >
                  <div className="text-left space-y-1">
                    <span className="text-[8.5px] uppercase tracking-wider text-[#DFBA73] block font-bold">
                      {item.category?.name || "Main Course"}
                    </span>
                    <h4 className="text-xs font-semibold text-white leading-snug truncate">
                      {item.name}
                    </h4>
                  </div>
                  
                  <div className="flex justify-between items-baseline pt-2">
                    <span className="text-xs font-mono font-bold text-white">₹{item.price}</span>
                    <div className="h-6 w-6 border border-zinc-800 hover:border-gold/30 rounded flex items-center justify-center text-zinc-500 hover:text-[#DFBA73] transition-colors">
                      <Plus className="h-3.5 w-3.5" />
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* RIGHT: Active Cart Billing calculation */}
      <div className="w-96 bg-zinc-900/20 flex flex-col justify-between overflow-y-auto p-5 border-l border-zinc-800 text-left space-y-4">
        {/* Header Metadata */}
        <div className="space-y-4">
          <div className="flex justify-between items-center border-b border-zinc-800 pb-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-400">Order Cart</h4>
            <span className="text-xs font-mono font-bold text-[#DFBA73]">{cart.length} items</span>
          </div>

          {/* Customer configurations */}
          <div className="space-y-3.5 text-xs border-b border-zinc-800 pb-4">
            <div className="grid grid-cols-2 gap-3">
              <input
                value={custName}
                onChange={(e) => setCustName(e.target.value)}
                placeholder="Guest Name"
                className="bg-zinc-950 border border-zinc-800 px-3 py-2 rounded text-xs text-white placeholder-zinc-600 outline-none focus:border-gold"
              />
              <input
                value={custPhone}
                onChange={(e) => setCustPhone(e.target.value)}
                placeholder="Phone Number"
                className="bg-zinc-950 border border-zinc-800 px-3 py-2 rounded text-xs text-white placeholder-zinc-600 outline-none focus:border-gold"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              <input
                value={tableNum}
                onChange={(e) => setTableNum(e.target.value)}
                placeholder="Table Number"
                className="bg-zinc-950 border border-zinc-800 px-3 py-2 rounded text-xs text-white placeholder-zinc-600 outline-none focus:border-gold"
              />
              <select
                value={orderType}
                onChange={(e: any) => setOrderType(e.target.value)}
                className="bg-zinc-950 border border-zinc-800 px-3 py-2 rounded text-xs text-white outline-none focus:border-gold"
              >
                <option value="dine-in">Dine-In</option>
                <option value="takeaway">Takeaway</option>
                <option value="room-service">Room Service</option>
              </select>
            </div>
          </div>
        </div>

        {/* Cart Item rows list */}
        <div className="flex-1 overflow-y-auto space-y-3 pr-1">
          {cart.map((item) => (
            <div key={item.id} className="flex justify-between items-center gap-4 text-xs">
              <div className="space-y-0.5 max-w-[120px] truncate">
                <span className="font-semibold text-white block truncate">{item.name}</span>
                <span className="text-[10px] text-zinc-500 font-mono">₹{item.price} each</span>
              </div>

              {/* Qty count adjusters */}
              <div className="flex items-center gap-2 border border-zinc-800 rounded bg-zinc-950 px-2 py-1">
                <button onClick={() => updateQty(item.id, -1)} className="text-zinc-500 hover:text-white cursor-pointer">
                  <Minus className="h-3 w-3" />
                </button>
                <span className="font-mono text-xs font-bold text-white px-1.5">{item.qty}</span>
                <button onClick={() => updateQty(item.id, 1)} className="text-zinc-500 hover:text-white cursor-pointer">
                  <Plus className="h-3 w-3" />
                </button>
              </div>

              {/* Subtotal & trash */}
              <div className="flex items-center gap-3">
                <span className="font-mono text-xs font-semibold text-white">₹{item.qty * item.price}</span>
                <button onClick={() => removeItem(item.id)} className="text-zinc-600 hover:text-red-400 cursor-pointer">
                  <Trash className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          ))}

          {cart.length === 0 && (
            <div className="text-center py-20 text-zinc-600 text-xs">
              Add dishes from catalog to begin
            </div>
          )}
        </div>

        {/* Mathematical summary */}
        <div className="space-y-3.5 border-t border-zinc-800 pt-4 text-xs">
          <div className="flex justify-between">
            <span className="text-zinc-500">Subtotal</span>
            <span className="font-mono">₹{subtotal.toFixed(2)}</span>
          </div>

          <div className="flex justify-between">
            <span className="text-zinc-500">GST (5%)</span>
            <span className="font-mono">₹{gstAmt.toFixed(2)}</span>
          </div>

          <div className="flex justify-between items-center gap-4">
            <span className="text-zinc-500">Discount (₹)</span>
            <input
              type="number"
              value={discount || ""}
              onChange={(e) => setDiscount(Number(e.target.value))}
              placeholder="0.00"
              className="w-20 bg-zinc-950 border border-zinc-800 px-2 py-1 rounded text-right font-mono text-xs text-white outline-none focus:border-gold"
            />
          </div>

          {/* Payment method triggers */}
          <div className="grid grid-cols-3 gap-2 pt-2">
            {(["CASH", "UPI", "CARD"] as const).map((method) => (
              <button
                key={method}
                onClick={() => setPaymentMethod(method)}
                className={`py-2 text-[8.5px] uppercase tracking-wider font-bold border rounded transition-colors cursor-pointer text-center ${
                  paymentMethod === method
                    ? "bg-[#DFBA73] text-black border-[#DFBA73]"
                    : "bg-zinc-950 text-zinc-500 border-zinc-800 hover:border-zinc-700"
                }`}
              >
                {method}
              </button>
            ))}
          </div>

          <div className="flex justify-between items-baseline border-t border-zinc-800 pt-3">
            <span className="font-serif text-sm text-zinc-300">Grand Total</span>
            <span className="font-mono text-base font-bold text-white">₹{grandTotal.toFixed(2)}</span>
          </div>

          {/* Checkout CTA */}
          <div className="pt-2 font-buttons">
            <button
              onClick={handleCheckout}
              disabled={cart.length === 0}
              className="w-full py-4.5 bg-[#DFBA73] hover:bg-[#8B5E3C] disabled:bg-zinc-800 disabled:text-zinc-600 disabled:cursor-not-allowed border-none text-[#0F1115] hover:text-white text-[10px] uppercase tracking-widest font-bold rounded-sm cursor-pointer transition-all duration-300 shadow-md"
            >
              Save Order & Print Ticket
            </button>
          </div>
        </div>
      </div>

      {/* Fullscreen Thermal receipt preview popup */}
      <AnimatePresence>
        {completedOrder && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-md flex items-center justify-center p-6"
            onClick={clearOrder}
          >
            <div
              className="relative w-full max-w-sm border border-zinc-800 bg-zinc-950 p-6 rounded-xl shadow-lux font-mono text-xs text-zinc-300 max-h-[90vh] overflow-y-auto text-left relative"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close controls */}
              <button
                onClick={clearOrder}
                className="absolute top-4 right-4 text-zinc-500 hover:text-white cursor-pointer"
                aria-label="Close bill popup"
              >
                <X className="h-4.5 w-4.5" />
              </button>

              {/* Receipt Content */}
              <div className="text-center space-y-1 pb-4 border-b border-dashed border-zinc-800">
                <h3 className="font-serif text-base text-white tracking-wider font-bold">HOTEL YASH GRAND</h3>
                <p className="text-[10px] text-zinc-500 leading-normal">
                  Restaurant & Banquet Facility <br />
                  Near SMS College, Varanasi, UP <br />
                  GSTIN: 09AAAAA0000A1Z5
                </p>
              </div>

              {/* Metadata */}
              <div className="py-4 border-b border-dashed border-zinc-800 space-y-1 text-[10.5px]">
                <div className="flex justify-between select-text">
                  <span>INVOICE: {completedOrder.id}</span>
                  <span>TABLE: {completedOrder.table}</span>
                </div>
                <div className="flex justify-between select-text">
                  <span>DATE: {completedOrder.time}</span>
                  <span>TYPE: {completedOrder.type.toUpperCase()}</span>
                </div>
                <div className="flex justify-between select-text">
                  <span>GUEST: {completedOrder.customerName}</span>
                  <span>PHONE: {completedOrder.customerPhone}</span>
                </div>
              </div>

              {/* Items grid */}
              <div className="py-4 border-b border-dashed border-zinc-800 space-y-2.5">
                <div className="flex justify-between text-zinc-500 font-bold">
                  <span className="w-1/2">Item Name</span>
                  <span className="w-1/6 text-center">Qty</span>
                  <span className="w-1/3 text-right">Price</span>
                </div>

                {completedOrder.items.map((item: any, idx: number) => (
                  <div key={idx} className="flex justify-between items-baseline select-text">
                    <span className="w-1/2 text-white font-medium">{item.name}</span>
                    <span className="w-1/6 text-center">{item.qty}</span>
                    <span className="w-1/3 text-right">₹{(item.qty * item.price).toFixed(2)}</span>
                  </div>
                ))}
              </div>

              {/* Totals */}
              <div className="py-4 space-y-2 border-b border-dashed border-zinc-800 text-[11px]">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>₹{completedOrder.subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-emerald-400">
                  <span>Discount</span>
                  <span>-₹{completedOrder.discount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>GST (5%)</span>
                  <span>₹{completedOrder.gst.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-white text-sm font-bold pt-1">
                  <span>Grand Total</span>
                  <span>₹{completedOrder.total.toFixed(2)}</span>
                </div>
              </div>

              {/* Footer */}
              <div className="text-center pt-4 space-y-4">
                <div className="flex justify-center items-center gap-1.5 text-[10px] text-zinc-500">
                  <CreditCard className="h-3.5 w-3.5" />
                  <span>Paid via {completedOrder.payment.toUpperCase()}</span>
                </div>
                
                <p className="text-[10px] text-[#DFBA73] font-serif italic pb-3">
                  Thank You! Visit Again
                </p>

                <button
                  onClick={handlePrint}
                  className="w-full py-3 bg-[#DFBA73] hover:bg-[#8B5E3C] border-none text-[#0F1115] hover:text-white text-[9px] uppercase tracking-widest font-bold rounded-sm flex items-center justify-center gap-2 cursor-pointer transition-all duration-300 shadow-md"
                >
                  <Printer className="h-3.5 w-3.5" />
                  <span>Print Thermal Bill</span>
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
