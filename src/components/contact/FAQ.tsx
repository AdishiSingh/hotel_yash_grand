import React, { useState } from "react";
import { ChevronDown, ChevronUp, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const FAQS = [
  {
    question: "How do I secure an online booking?",
    answer: "You can submit an inquiry through our Booking Hub above or click the WhatsApp trigger. Our reservation captain will confirm slot availability and forward safe payment links to secure your room or event."
  },
  {
    question: "What is the check-in and check-out timing?",
    answer: "Our standard check-in time is 12:00 PM and check-out is 11:00 AM. Early check-in or late check-out is subject to room availability and can be requested during booking."
  },
  {
    question: "What is your room cancellation policy?",
    answer: "Cancellations made 48 hours prior to the check-in date receive a full refund. Cancellations inside 48 hours or no-shows incur a 1-night room charge penalty."
  },
  {
    question: "Is there on-site parking available?",
    answer: "Yes, we provide complimentary secure valet parking inside the hotel gates for all dining, room, and banquet event guests."
  },
  {
    question: "What are the timings of the restaurant?",
    answer: "Our restaurant serves gourmet Veg & Non-Veg multi-cuisine meals from 07:00 AM to 11:00 PM daily. Room service operates 24/7 for in-house room guests."
  },
  {
    question: "What is the maximum capacity of your Banquet Hall?",
    answer: "The Grand Ballroom can hold up to 500+ guests when integrated with the outdoor lawn setups, making it ideal for Varanasi weddings and receptions."
  },
  {
    question: "Do you allow outside decoration panels for weddings?",
    answer: "Yes! While we offer top-tier standard floral/theme panels, you are welcome to bring your preferred wedding decorators with prior approval."
  },
  {
    question: "What payment options are supported?",
    answer: "We accept all major credit/debit cards, UPI transfers (GPay, PhonePe, Paytm), net banking, and corporate account invoicing coordinates."
  }
];

export function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleAccordion = (idx: number) => {
    setOpenIndex((prev) => (prev === idx ? null : idx));
  };

  return (
    <div className="space-y-16 select-none border-t border-white/5 pt-28">
      {/* Header */}
      <div className="text-center space-y-4 max-w-2xl mx-auto">
        <div className="flex items-center justify-center gap-2.5">
          <Sparkles className="w-3.5 h-3.5 text-gold animate-pulse" />
          <span className="text-[10px] uppercase tracking-[0.35em] text-[#C8A97E] font-bold font-sans">
            03 // General Inquiries
          </span>
        </div>
        <h2 className="font-serif text-3xl sm:text-5xl font-light text-white leading-tight">
          Frequently Asked Questions
        </h2>
      </div>

      {/* Accordion list */}
      <div className="max-w-3xl mx-auto space-y-4">
        {FAQS.map((faq, idx) => {
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
