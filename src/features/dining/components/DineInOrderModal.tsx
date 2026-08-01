"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, CheckCircle2, Utensils, Send, User, Phone, Edit2, AlertCircle } from "lucide-react";
import { CartItem } from "@/components/menu/useMenu";
import { useBookingGuard } from "@/context/BookingGuardContext";
import { 
  generateOrderId, 
  formatOrderDate, 
  buildWhatsAppOrderMessage, 
  OrderItem 
} from "../utils/formatWhatsAppOrder";
import { dbEngine } from "@/lib/db";

const RESTAURANT_WHATSAPP_NUMBER = "919151088115";

interface DineInOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  cart: CartItem[];
  cartTotal: number;
  onOrderSuccess: () => void;
  tableNumberParam?: string;
}

export function DineInOrderModal({
  isOpen,
  onClose,
  cart,
  cartTotal,
  onOrderSuccess,
  tableNumberParam,
}: DineInOrderModalProps) {
  const { requireAuth } = useBookingGuard();
  const [tableInput, setTableInput] = React.useState<string>("");
  const [customerName, setCustomerName] = React.useState<string>("");
  const [customerPhone, setCustomerPhone] = React.useState<string>("");
  const [step, setStep] = React.useState<"details" | "summary" | "confirmed">("details");
  const [validationError, setValidationError] = React.useState<string | null>(null);
  const [orderId, setOrderId] = React.useState<string>("");
  const [orderTimeInfo, setOrderTimeInfo] = React.useState<{ dateStr: string; timeStr: string }>({ dateStr: "", timeStr: "" });

  // Helper to format table number string nicely (e.g., "12" -> "T-12", "5" -> "T-05", "T-30" -> "T-30")
  const formatTableNumber = React.useCallback((input: string): string => {
    const clean = input.trim().toUpperCase();
    if (!clean) return "";
    if (clean.startsWith("T-")) {
      const numPart = clean.replace("T-", "");
      if (!isNaN(Number(numPart)) && numPart.length > 0) {
        return `T-${numPart.padStart(2, "0")}`;
      }
      return clean;
    }
    if (!isNaN(Number(clean))) {
      return `T-${clean.padStart(2, "0")}`;
    }
    return `T-${clean}`;
  }, []);

  // Initialize or auto-detect table number from URL / localStorage on open
  React.useEffect(() => {
    if (isOpen) {
      const { dateStr, timeStr } = formatOrderDate();
      setOrderTimeInfo({ dateStr, timeStr });
      setOrderId(generateOrderId());

      // 1. URL parameter parameter
      if (tableNumberParam && tableNumberParam.trim()) {
        const formatted = formatTableNumber(tableNumberParam);
        setTableInput(formatted);
        localStorage.setItem("yash_table_number", formatted);
        setStep("summary");
        return;
      }

      // 2. Saved table in localStorage
      const savedTable = localStorage.getItem("yash_table_number");
      if (savedTable && savedTable.trim()) {
        setTableInput(savedTable);
        setStep("summary");
      } else {
        setStep("details");
      }
    }
  }, [isOpen, tableNumberParam, formatTableNumber]);

  if (!isOpen) return null;

  const totalItemsCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const formattedTableNumber = formatTableNumber(tableInput);

  const handleProceedToSummary = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!tableInput || !tableInput.trim()) {
      setValidationError("Please enter your table number.");
      return;
    }
    const formatted = formatTableNumber(tableInput);
    localStorage.setItem("yash_table_number", formatted);
    setValidationError(null);
    setStep("summary");
  };

  const handleConfirmOrder = async () => {
    requireAuth(async (authenticatedCustomer) => {
      // Validation
      if (!formattedTableNumber) {
        setValidationError("Please enter your table number.");
        setStep("details");
        return;
      }

      if (cart.length === 0) {
        setValidationError("Your cart is empty. Please add items from the menu.");
        return;
      }

      const activeName = customerName.trim() || authenticatedCustomer.name || "Guest";
      const activePhone = customerPhone.trim() || authenticatedCustomer.phone;

      // Map cart items
      const orderItems: OrderItem[] = cart.map(({ item, quantity, selectedVariant }) => ({
        name: item.name,
        category: item.category,
        quantity,
        price: selectedVariant ? selectedVariant.price : item.price,
        variantLabel: selectedVariant?.label,
      }));

      // Build WhatsApp formatted message
      const message = buildWhatsAppOrderMessage({
        orderId,
        customerName: activeName,
        tableNumber: formattedTableNumber,
        items: orderItems,
        totalItems: totalItemsCount,
        totalBill: cartTotal,
        orderDateStr: orderTimeInfo.dateStr,
        orderTimeStr: orderTimeInfo.timeStr,
      });

      // Save order into PostgreSQL Database via API Endpoint
      try {
        const response = await fetch("/api/orders", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            tableNumber: formattedTableNumber,
            customerName: activeName,
            customerPhone: activePhone || undefined,
            paymentMethod: "UPI",
            discount: 0,
            items: cart.map(({ item, quantity, selectedVariant }) => ({
              menuItemId: item.id || "custom-menu-item",
              itemName: `${item.name}${selectedVariant ? ` (${selectedVariant.label})` : ""}`,
              quantity,
              price: selectedVariant ? selectedVariant.price : item.price,
              variantLabel: selectedVariant?.label,
            })),
          }),
        });

        const json = await response.json();
        if (!response.ok || !json.success) {
          console.error("Failed to persist order in PostgreSQL:", json);
        }
      } catch (e) {
        console.error("API POST /api/orders error:", e);
      }

      // Open official WhatsApp deep link
      const encodedMessage = encodeURIComponent(message);
      const whatsappUrl = `https://wa.me/${RESTAURANT_WHATSAPP_NUMBER}?text=${encodedMessage}`;
      
      window.open(whatsappUrl, "_blank");

      // Advance to confirmation screen
      setStep("confirmed");
    }, {
      customerName,
      customerPhone,
      tableNumber: formattedTableNumber,
    });
  };

  const handleFinish = () => {
    onOrderSuccess();
    onClose();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] bg-black/85 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          transition={{ duration: 0.25 }}
          className="relative w-full max-w-md bg-[#0F1115] border border-[#C5A880]/30 rounded-2xl shadow-lux overflow-hidden text-foreground flex flex-col max-h-[90vh]"
        >
          {/* Top Header */}
          <div className="p-5 sm:p-6 border-b border-white/10 bg-neutral-950 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-sm bg-[#C5A880]/15 border border-[#C5A880]/30 flex items-center justify-center text-[#C5A880]">
                <Utensils className="h-4.5 w-4.5" />
              </div>
              <div>
                <h3 className="font-serif text-base sm:text-lg font-semibold text-white tracking-wide">
                  HOTEL YASH GRAND
                </h3>
                <p className="text-[9.5px] uppercase tracking-[0.25em] text-[#C5A880] font-sans font-semibold">
                  Digital Dining & QR Order
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 text-neutral-400 hover:text-white hover:bg-white/5 rounded-sm transition-colors cursor-pointer"
              aria-label="Close modal"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Validation Error Banner */}
          {validationError && (
            <div className="bg-red-950/80 border-b border-red-500/30 p-3 px-6 text-xs text-red-200 flex items-center gap-2">
              <AlertCircle className="h-4 w-4 text-red-400 shrink-0" />
              <span>{validationError}</span>
            </div>
          )}

          {/* Scrollable Body Content */}
          <div className="p-5 sm:p-6 overflow-y-auto flex-1 space-y-6 scrollbar-none font-sans">
            
            {/* STEP 1: Elegant Table Number & Customer Details Form */}
            {step === "details" && (
              <form onSubmit={handleProceedToSummary} className="space-y-6 animate-fade-in">
                <div className="space-y-2 text-center sm:text-left">
                  <h4 className="font-serif text-2xl text-white font-light">
                    Welcome to HOTEL YASH GRAND
                  </h4>
                  <p className="text-xs text-neutral-400 font-light leading-relaxed">
                    Please enter your table number so our team can deliver your order accurately.
                  </p>
                </div>

                {/* Table Number Single Input */}
                <div className="space-y-2 pt-2">
                  <label className="text-xs uppercase tracking-widest font-bold text-[#C5A880] flex items-center gap-1.5">
                    <span>Table Number</span>
                    <span className="text-red-400">*</span>
                  </label>
                  
                  <input
                    type="text"
                    value={tableInput}
                    onChange={(e) => {
                      setTableInput(e.target.value);
                      if (validationError) setValidationError(null);
                    }}
                    placeholder="Example: 12"
                    required
                    className="w-full bg-neutral-900 border border-white/15 focus:border-[#C5A880] px-4 py-3 rounded-sm text-sm text-white placeholder-neutral-500 outline-none transition-colors font-mono"
                  />
                  <p className="text-[10px] text-neutral-400 font-light">
                    Accepts table numbers like 1, 12, 25, 50, 100...
                  </p>
                </div>

                {/* Optional Customer Information */}
                <div className="pt-4 border-t border-white/10 space-y-4">
                  <div className="space-y-1">
                    <span className="text-xs uppercase tracking-widest font-bold text-[#C5A880] block">
                      Guest Details (Optional)
                    </span>
                    <p className="text-[11px] text-neutral-400 font-light">
                      If left empty, your order will be placed as &quot;Guest&quot;.
                    </p>
                  </div>
                  
                  <div className="space-y-3">
                    <div>
                      <div className="flex items-center gap-2 mb-1.5 text-[11px] text-neutral-400">
                        <User className="h-3.5 w-3.5 text-[#C5A880]" />
                        <span>Customer Name</span>
                      </div>
                      <input
                        type="text"
                        value={customerName}
                        onChange={(e) => setCustomerName(e.target.value)}
                        placeholder="John Doe"
                        className="w-full bg-neutral-900 border border-white/10 focus:border-[#C5A880] px-3.5 py-2.5 rounded-sm text-xs text-white placeholder-neutral-600 outline-none"
                      />
                    </div>

                    <div>
                      <div className="flex items-center gap-2 mb-1.5 text-[11px] text-neutral-400">
                        <Phone className="h-3.5 w-3.5 text-[#C5A880]" />
                        <span>Phone Number</span>
                      </div>
                      <input
                        type="tel"
                        value={customerPhone}
                        onChange={(e) => setCustomerPhone(e.target.value)}
                        placeholder="+91 99999 99999"
                        className="w-full bg-neutral-900 border border-white/10 focus:border-[#C5A880] px-3.5 py-2.5 rounded-sm text-xs text-white placeholder-neutral-600 outline-none"
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    className="w-full py-4 bg-[#C5A880] hover:bg-[#A37C40] text-black hover:text-white font-bold text-xs uppercase tracking-widest transition-all rounded-sm shadow-md cursor-pointer min-h-[48px] flex items-center justify-center gap-2"
                  >
                    <span>Continue to Order →</span>
                  </button>
                </div>
              </form>
            )}

            {/* STEP 2: Order Review & Summary */}
            {step === "summary" && (
              <div className="space-y-6 animate-fade-in">
                {/* Meta Header Badge */}
                <div className="bg-neutral-900 p-4 rounded-lg border border-white/5 flex items-center justify-between">
                  <div className="space-y-1">
                    <span className="text-[9px] uppercase tracking-widest text-[#C5A880] font-bold block">
                      Order ID: {orderId}
                    </span>
                    <div className="flex items-center gap-2 text-xs text-white">
                      <span>Table: <strong className="text-[#C5A880] font-mono text-sm">{formattedTableNumber || "Not Set"}</strong></span>
                      <span>•</span>
                      <span>Ordered By: <strong>{customerName.trim() || "Guest"}</strong></span>
                    </div>
                  </div>

                  <button
                    onClick={() => setStep("details")}
                    className="text-[10px] uppercase tracking-wider text-[#C5A880] hover:text-white flex items-center gap-1 cursor-pointer bg-white/5 px-2.5 py-1.5 rounded-sm border border-[#C5A880]/20"
                  >
                    <Edit2 className="h-3 w-3" />
                    <span>Edit</span>
                  </button>
                </div>

                {/* Itemized Order List */}
                <div className="space-y-3">
                  <h4 className="text-xs uppercase tracking-widest font-bold text-neutral-300 border-b border-white/10 pb-2">
                    Itemized Order Summary ({totalItemsCount} items)
                  </h4>

                  <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                    {cart.map(({ item, quantity, selectedVariant }, idx) => {
                      const price = selectedVariant ? selectedVariant.price : item.price;
                      return (
                        <div key={idx} className="flex justify-between items-center text-xs py-1.5 border-b border-white/5">
                          <div className="space-y-0.5">
                            <span className="font-medium text-white block">
                              {quantity} × {item.name} {selectedVariant && <span className="text-neutral-400">({selectedVariant.label})</span>}
                            </span>
                            <span className="text-[10px] text-neutral-400 font-mono">₹{price} each</span>
                          </div>
                          <span className="font-mono text-[#C5A880] font-bold">₹{price * quantity}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Calculations & Total */}
                <div className="border-t border-white/10 pt-4 space-y-2 text-xs">
                  <div className="flex justify-between text-neutral-400">
                    <span>Total Quantity</span>
                    <span className="font-mono font-medium text-white">{totalItemsCount} items</span>
                  </div>
                  <div className="flex justify-between text-neutral-400">
                    <span>Order Date & Time</span>
                    <span className="font-mono text-neutral-300">{orderTimeInfo.dateStr} {orderTimeInfo.timeStr}</span>
                  </div>
                  <div className="h-px bg-white/10 my-2" />
                  <div className="flex justify-between text-sm text-[#C5A880] font-bold">
                    <span>Total Bill</span>
                    <span className="font-mono text-base">₹{cartTotal}</span>
                  </div>
                </div>

                {/* WhatsApp Dispatch Button */}
                <div className="pt-2 space-y-3">
                  <button
                    onClick={handleConfirmOrder}
                    className="w-full py-4 bg-[#25D366] hover:bg-[#1DA851] text-black font-bold text-xs uppercase tracking-widest transition-all rounded-sm shadow-lux flex items-center justify-center gap-2.5 cursor-pointer min-h-[48px]"
                  >
                    <Send className="h-4 w-4" />
                    <span>Send Order via WhatsApp →</span>
                  </button>
                  <p className="text-[10px] text-neutral-400 text-center font-light leading-relaxed">
                    Clicking opens official WhatsApp with your formatted order details.
                  </p>
                </div>
              </div>
            )}

            {/* STEP 3: Post-Order Thank You Screen */}
            {step === "confirmed" && (
              <div className="py-8 text-center space-y-6 animate-fade-in">
                <div className="h-16 w-16 bg-[#C5A880]/15 rounded-full border border-[#C5A880]/30 flex items-center justify-center mx-auto text-[#C5A880]">
                  <CheckCircle2 className="h-8 w-8" />
                </div>

                <div className="space-y-3 max-w-md mx-auto">
                  <h4 className="font-serif text-2xl text-white">
                    Thank you for ordering from HOTEL YASH GRAND.
                  </h4>
                  <p className="text-xs text-neutral-300 leading-relaxed font-light">
                    Your order has been sent to our restaurant. Please wait while our team prepares your food for Table <strong className="text-[#C5A880] font-mono">{formattedTableNumber}</strong>.
                  </p>
                </div>

                <div className="p-4 bg-neutral-900 border border-white/5 rounded-lg text-xs space-y-1 font-mono text-neutral-400">
                  <div>Order ID: <span className="text-[#C5A880]">{orderId}</span></div>
                  <div>Estimated Prep Time: <span className="text-white font-bold">15 - 20 Minutes</span></div>
                </div>

                <button
                  onClick={handleFinish}
                  className="w-full py-3.5 bg-neutral-800 hover:bg-[#C5A880] text-neutral-200 hover:text-black font-bold text-xs uppercase tracking-widest transition-colors rounded-sm border border-white/10 cursor-pointer min-h-[48px]"
                >
                  Back to Digital Menu
                </button>
              </div>
            )}

          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
