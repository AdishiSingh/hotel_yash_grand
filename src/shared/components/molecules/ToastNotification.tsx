"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, ShoppingBag } from "lucide-react";

export interface ToastItem {
  id: string;
  itemName: string;
  price: number;
}

interface ToastNotificationProps {
  toast: ToastItem | null;
  onDismiss: () => void;
}

export function ToastNotification({ toast, onDismiss }: ToastNotificationProps) {
  React.useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => {
        onDismiss();
      }, 2500);
      return () => clearTimeout(timer);
    }
  }, [toast, onDismiss]);

  return (
    <AnimatePresence>
      {toast && (
        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.95 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
          className="fixed bottom-24 right-6 z-[100] max-w-sm w-[calc(100vw-3rem)] sm:w-auto bg-[#0F1115]/95 border border-[#C5A880]/40 p-4 rounded-xl shadow-lux backdrop-blur-xl flex items-center gap-3 text-white select-none"
        >
          <div className="h-9 w-9 rounded-full bg-[#C5A880]/15 border border-[#C5A880]/30 flex items-center justify-center text-[#C5A880] shrink-0">
            <CheckCircle2 className="h-5 w-5" />
          </div>

          <div className="flex-1 space-y-0.5">
            <div className="flex items-center gap-2">
              <span className="font-serif text-sm font-semibold text-white">
                {toast.itemName}
              </span>
              <span className="text-[10px] uppercase font-bold text-[#C5A880] font-mono">
                ₹{toast.price}
              </span>
            </div>
            <p className="text-[11px] text-neutral-400 font-light flex items-center gap-1">
              <ShoppingBag className="h-3 w-3 text-[#C5A880]" />
              <span>Added to your cart successfully</span>
            </p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
