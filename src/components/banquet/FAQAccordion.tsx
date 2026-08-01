import React, { useState } from "react";
import { BANQUET_DATA } from "@/data/banquet";
import { ChevronDown, ChevronUp, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export function FAQAccordion() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleAccordion = (idx: number) => {
    setOpenIndex((prev) => (prev === idx ? null : idx));
  };

  return (
    <div className="space-y-16 select-none border-t border-white/5 pt-28">
      {/* Header */}
      <div className="text-center space-y-4 max-w-2xl mx-auto">
        <div className="flex items-center justify-center gap-2.5">
          <Sparkles className="w-3.5 h-3.5 text-gold" />
          <span className="text-[10px] uppercase tracking-[0.35em] text-[#C8A97E] font-bold font-sans">
            09 // Frequently Asked Questions
          </span>
        </div>
        <h2 className="font-serif text-3xl sm:text-5xl font-light text-white leading-tight">
          Banquet Inquiries & Policies
        </h2>
      </div>

      {/* Accordion List */}
      <div className="max-w-3xl mx-auto space-y-4">
        {BANQUET_DATA.faqs.map((faq, idx) => {
          const isOpen = openIndex === idx;
          
          return (
            <div
              key={idx}
              className="border border-white/5 bg-[#14161C]/35 rounded-lg overflow-hidden transition-colors hover:border-gold/15"
            >
              {/* Question Trigger */}
              <button
                onClick={() => toggleAccordion(idx)}
                className="w-full flex items-center justify-between p-5 text-left text-white font-serif text-sm sm:text-base font-medium cursor-pointer"
              >
                <span>{faq.question}</span>
                {isOpen ? (
                  <ChevronUp className="h-4 w-4 text-gold" />
                ) : (
                  <ChevronDown className="h-4 w-4 text-neutral-500" />
                )}
              </button>

              {/* Answer Content */}
              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="p-5 pt-0 border-t border-white/5 text-xs sm:text-sm text-neutral-400 font-sans font-light leading-relaxed select-text">
                      {faq.answer}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </div>
  );
}
