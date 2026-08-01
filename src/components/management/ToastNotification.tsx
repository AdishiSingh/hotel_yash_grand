"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, AlertTriangle, X } from "lucide-react";

export interface ToastMessage {
  id: string;
  type: "success" | "error";
  title: string;
  message?: string;
}

interface ToastProps {
  toast: ToastMessage | null;
  onClose: () => void;
}

export function ToastNotification({ toast, onClose }: ToastProps) {
  if (!toast) return null;

  return (
    <AnimatePresence>
      <div className="fixed bottom-6 right-6 z-50 pointer-events-auto">
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.95 }}
          className={`p-4 rounded-xl border shadow-2xl flex items-center gap-3 font-mono text-xs max-w-sm text-white backdrop-blur-xl ${
            toast.type === "success"
              ? "bg-emerald-950/90 border-emerald-500/50 text-emerald-100"
              : "bg-red-950/90 border-red-500/50 text-red-100"
          }`}
        >
          {toast.type === "success" ? (
            <CheckCircle2 className="h-5 w-5 text-emerald-400 shrink-0" />
          ) : (
            <AlertTriangle className="h-5 w-5 text-red-400 shrink-0" />
          )}

          <div className="flex-1">
            <div className="font-bold text-xs">{toast.title}</div>
            {toast.message && <div className="text-[10.5px] opacity-80 mt-0.5">{toast.message}</div>}
          </div>

          <button onClick={onClose} className="p-1 opacity-70 hover:opacity-100 rounded">
            <X className="h-4 w-4" />
          </button>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
