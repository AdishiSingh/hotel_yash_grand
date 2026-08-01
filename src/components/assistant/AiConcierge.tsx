"use client";

import React, { useState, useRef, useEffect } from "react";
import { X, Send, Sparkles, User, Utensils, Hotel, Calendar, Clock, Phone, Package, Compass } from "lucide-react";
import { processUserQuery, AIResponse } from "@/ai/assistant/chatEngine";
import { motion, AnimatePresence } from "framer-motion";
import { SadyaMascot } from "./SadyaMascot";

interface ChatMessage {
  sender: "user" | "sadya";
  text: string;
  dishes?: any[];
  suggestions?: string[];
}

export function AiConcierge() {
  const [isOpen, setIsOpen] = useState(false);
  const [showGreeting, setShowGreeting] = useState(false);
  const [query, setQuery] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      sender: "sadya",
      text: "Namaste! 🙏 I am SADYA, your Digital Hospitality Concierge at HOTEL YASH GRAND. How may I assist your stay or dining today?"
    }
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  // Timed 6-second welcome speech bubble logic (once per session)
  useEffect(() => {
    if (typeof window === "undefined") return;

    const hasSeenGreeting = sessionStorage.getItem("has_seen_sadya_greeting");
    if (!hasSeenGreeting) {
      const showTimer = setTimeout(() => {
        setShowGreeting(true);
        sessionStorage.setItem("has_seen_sadya_greeting", "true");
        
        // Auto-dismiss bubble after 7 seconds
        const dismissTimer = setTimeout(() => {
          setShowGreeting(false);
        }, 7000);

        return () => clearTimeout(dismissTimer);
      }, 6000);

      return () => clearTimeout(showTimer);
    }
  }, []);

  const handleSend = async (textToSend: string) => {
    if (!textToSend.trim()) return;

    // Dismiss greeting bubble if open
    setShowGreeting(false);

    // Append user message
    const userMsg: ChatMessage = { sender: "user", text: textToSend };
    setMessages((prev) => [...prev, userMsg]);
    setQuery("");

    try {
      const res = await fetch("/api/ai/concierge", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          query: textToSend,
          history: messages.map((m) => ({ sender: m.sender, text: m.text })),
        }),
      });

      const json = await res.json();

      if (json.success && json.data) {
        const response: AIResponse = json.data;
        const sadyaMsg: ChatMessage = {
          sender: "sadya",
          text: response.answer,
          dishes: response.dishes,
          suggestions: response.suggestions,
        };
        setMessages((prev) => [...prev, sadyaMsg]);
      } else {
        const fallbackMsg: ChatMessage = {
          sender: "sadya",
          text: "Namaste! 🙏 I am SADYA. Hotel Yash Grand offers 24/7 stays, dining, and wedding banquets. You can reach our front desk at +91 91510 88115.",
          suggestions: ["Book A Room", "View Menu", "Speak to Manager"],
        };
        setMessages((prev) => [...prev, fallbackMsg]);
      }
    } catch (err) {
      console.error("Failed to connect to SADYA AI Concierge API:", err);
      const fallbackMsg: ChatMessage = {
        sender: "sadya",
        text: "I am experiencing a momentary network disconnect. Please call our front desk at +91 91510 88115.",
        suggestions: ["Call Reception", "Try Again"],
      };
      setMessages((prev) => [...prev, fallbackMsg]);
    }
  };

  return (
    <div className="fixed bottom-6 left-6 z-[90] select-none text-left font-sans">
      <AnimatePresence>
        
        {/* 1. TIMED WELCOME SPEECH BUBBLE */}
        {showGreeting && !isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.9 }}
            className="absolute bottom-20 left-0 mb-2 w-64 p-4 bg-[#0F1115] border border-[#C5A880]/40 rounded-2xl shadow-lux text-white space-y-1.5 cursor-pointer backdrop-blur-md"
            onClick={() => {
              setShowGreeting(false);
              setIsOpen(true);
            }}
          >
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-1.5 text-[#C5A880] font-serif text-xs font-semibold">
                <span>👋 Hi, I&apos;m SADYA</span>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowGreeting(false);
                }}
                className="text-neutral-500 hover:text-white"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
            <p className="text-xs text-neutral-300 font-light leading-relaxed">
              How can I help you today? Ask about rooms, banquet halls, or dish recommendations!
            </p>
            {/* Pointer arrow */}
            <div className="absolute -bottom-2 left-6 w-3 h-3 bg-[#0F1115] border-r border-b border-[#C5A880]/40 rotate-45" />
          </motion.div>
        )}

        {/* 2. EXPANDED CONCIERGE CHAT WINDOW */}
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="mb-4 w-[calc(100vw-3rem)] sm:w-96 border border-[#C5A880]/30 bg-[#0F1115]/95 backdrop-blur-xl rounded-2xl shadow-lux flex flex-col overflow-hidden h-[500px]"
          >
            {/* Header */}
            <div className="p-4 border-b border-white/10 bg-neutral-950 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <SadyaMascot size={36} />
                <div>
                  <h4 className="font-serif text-sm font-semibold text-white tracking-wide">SADYA</h4>
                  <span className="text-[10px] text-[#C5A880] font-sans font-light block">Your Digital Hospitality Concierge</span>
                </div>
              </div>

              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 text-neutral-400 hover:text-white hover:bg-white/5 rounded-sm transition-colors cursor-pointer"
                aria-label="Close concierge"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Chat Messages scroll area */}
            <div className="flex-1 p-4 overflow-y-auto space-y-4 scrollbar-none">
              {messages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex gap-2.5 max-w-[88%] ${
                    msg.sender === "user" ? "ml-auto flex-row-reverse" : "mr-auto"
                  }`}
                >
                  {msg.sender === "user" ? (
                    <div className="h-7 w-7 rounded-full bg-[#C5A880] text-black shrink-0 flex items-center justify-center text-xs font-bold">
                      <User className="h-3.5 w-3.5" />
                    </div>
                  ) : (
                    <SadyaMascot size={28} />
                  )}

                  <div className="space-y-2">
                    <div
                      className={`p-3.5 rounded-xl text-xs leading-relaxed select-text ${
                        msg.sender === "user"
                          ? "bg-[#C5A880] text-black rounded-tr-none font-medium"
                          : "bg-neutral-900 border border-white/10 text-neutral-200 rounded-tl-none font-light"
                      }`}
                    >
                      {msg.text}
                    </div>

                    {/* Dish Recommendation Cards */}
                    {msg.dishes && msg.dishes.length > 0 && (
                      <div className="grid grid-cols-1 gap-2 pt-1 w-full">
                        {msg.dishes.map((dish) => (
                          <div
                            key={dish.id}
                            className="p-3 bg-neutral-950 border border-white/10 rounded-lg flex justify-between items-center text-xs text-neutral-300"
                          >
                            <span className="font-medium text-white">{dish.name}</span>
                            <span className="font-mono text-[#C5A880] font-bold">₹{dish.price}</span>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Quick suggestion tags */}
                    {msg.suggestions && msg.suggestions.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {msg.suggestions.map((sug, i) => (
                          <button
                            key={i}
                            onClick={() => handleSend(sug)}
                            className="px-3 py-1 text-[10px] border border-white/10 hover:border-[#C5A880]/50 bg-neutral-900 hover:bg-[#C5A880]/15 text-neutral-300 hover:text-white rounded-full transition-all cursor-pointer"
                          >
                            {sug}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Quick Action Concierge Chips */}
            <div className="p-3 border-t border-white/10 bg-neutral-950/80 overflow-x-auto scrollbar-none flex gap-2">
              <button
                onClick={() => handleSend("What are the recommended chef signature dishes?")}
                className="px-3 py-1.5 bg-neutral-900 border border-white/10 hover:border-[#C5A880]/40 text-neutral-300 hover:text-white rounded-full text-[10.5px] whitespace-nowrap flex items-center gap-1.5 transition-colors cursor-pointer shrink-0"
              >
                <Utensils className="h-3 w-3 text-[#C5A880]" />
                <span>Recommend dishes</span>
              </button>

              <button
                onClick={() => handleSend("How do I book a luxury room suite?")}
                className="px-3 py-1.5 bg-neutral-900 border border-white/10 hover:border-[#C5A880]/40 text-neutral-300 hover:text-white rounded-full text-[10.5px] whitespace-nowrap flex items-center gap-1.5 transition-colors cursor-pointer shrink-0"
              >
                <Hotel className="h-3 w-3 text-[#C5A880]" />
                <span>Book a room</span>
              </button>

              <button
                onClick={() => handleSend("Tell me about wedding & banquet hall packages")}
                className="px-3 py-1.5 bg-neutral-900 border border-white/10 hover:border-[#C5A880]/40 text-neutral-300 hover:text-white rounded-full text-[10.5px] whitespace-nowrap flex items-center gap-1.5 transition-colors cursor-pointer shrink-0"
              >
                <Calendar className="h-3 w-3 text-[#C5A880]" />
                <span>Banquet enquiry</span>
              </button>

              <button
                onClick={() => handleSend("What are the restaurant opening hours?")}
                className="px-3 py-1.5 bg-neutral-900 border border-white/10 hover:border-[#C5A880]/40 text-neutral-300 hover:text-white rounded-full text-[10.5px] whitespace-nowrap flex items-center gap-1.5 transition-colors cursor-pointer shrink-0"
              >
                <Clock className="h-3 w-3 text-[#C5A880]" />
                <span>Restaurant timings</span>
              </button>

              <button
                onClick={() => handleSend("How do I contact reception & front desk?")}
                className="px-3 py-1.5 bg-neutral-900 border border-white/10 hover:border-[#C5A880]/40 text-neutral-300 hover:text-white rounded-full text-[10.5px] whitespace-nowrap flex items-center gap-1.5 transition-colors cursor-pointer shrink-0"
              >
                <Phone className="h-3 w-3 text-[#C5A880]" />
                <span>Contact reception</span>
              </button>

              <button
                onClick={() => handleSend("How do I track my food order status?")}
                className="px-3 py-1.5 bg-neutral-900 border border-white/10 hover:border-[#C5A880]/40 text-neutral-300 hover:text-white rounded-full text-[10.5px] whitespace-nowrap flex items-center gap-1.5 transition-colors cursor-pointer shrink-0"
              >
                <Package className="h-3 w-3 text-[#C5A880]" />
                <span>Track my order</span>
              </button>

              <button
                onClick={() => inputRef.current?.focus()}
                className="px-3 py-1.5 bg-neutral-900 border border-white/10 hover:border-[#C5A880]/40 text-neutral-300 hover:text-white rounded-full text-[10.5px] whitespace-nowrap flex items-center gap-1.5 transition-colors cursor-pointer shrink-0"
              >
                <Compass className="h-3 w-3 text-[#C5A880]" />
                <span>Ask anything</span>
              </button>
            </div>

            {/* Input form */}
            <div className="p-3 border-t border-white/10 bg-neutral-950 flex items-center gap-2">
              <input
                ref={inputRef}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleSend(query);
                }}
                placeholder="Ask SADYA about rooms, dining, banquets..."
                className="flex-1 bg-neutral-900 border border-white/10 focus:border-[#C5A880] px-3.5 py-2.5 rounded-lg text-xs text-white placeholder-neutral-500 outline-none transition-colors"
              />
              <button
                onClick={() => handleSend(query)}
                className="h-9 w-9 bg-[#C5A880] hover:bg-[#A37C40] text-black hover:text-white rounded-lg flex items-center justify-center cursor-pointer transition-all duration-200"
                aria-label="Send message to SADYA"
              >
                <Send className="h-4 w-4" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 3. FLOATING MASCOT BUTTON (BOTTOM-LEFT) */}
      <motion.button
        onClick={() => {
          setShowGreeting(false);
          setIsOpen(!isOpen);
        }}
        animate={{ y: [0, -5, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        className="relative p-1 rounded-full bg-[#0F1115] border border-[#C5A880]/50 hover:border-[#C5A880] text-white flex items-center justify-center cursor-pointer shadow-lux group transition-all duration-300 hover:scale-105 min-h-[56px] min-w-[56px]"
        aria-label="Open SADYA Hospitality Concierge"
      >
        <SadyaMascot size={48} />
        
        {/* Status indicator dot */}
        <span className="absolute bottom-1 right-1 h-3.5 w-3.5 rounded-full bg-emerald-500 border-2 border-[#0F1115] shadow-sm" />
      </motion.button>
    </div>
  );
}
