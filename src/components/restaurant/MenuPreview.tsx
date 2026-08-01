import React from "react";
import { Sparkles, UtensilsCrossed, Flame, IceCream, Pizza, Coffee, Compass } from "lucide-react";
import { motion } from "framer-motion";

const CATEGORIES = [
  {
    title: "Main Course",
    desc: "Aromatic vegetable gravies, Paneer specialties, and slow-cooked dals.",
    icon: Flame,
    slug: "main-course"
  },
  {
    title: "Chinese Wok",
    desc: "Spicy stir-fried noodles, manchurian dumplings, and fried rice delicacies.",
    icon: UtensilsCrossed,
    slug: "starter-chinese"
  },
  {
    title: "Pizza & Continental",
    desc: "Oven-baked cheese loaded pizzas and savory finger chips.",
    icon: Pizza,
    slug: "pizza"
  },
  {
    title: "South Indian Crepes",
    desc: "Crispy butter masala dosas, soft idlis, and traditional sambar infusions.",
    icon: Compass,
    slug: "south-indian"
  },
  {
    title: "Beverages & Lassis",
    desc: "Cold lassis, fresh shakes, hot ginger chai, and brewed coffee cups.",
    icon: Coffee,
    slug: "beverages"
  },
  {
    title: "Sweet Desserts",
    desc: "Hot gulab jamun cups, creamy ice creams, and traditional treats.",
    icon: IceCream,
    slug: "desserts"
  }
];

export function MenuPreview() {
  const handleCategoryRedirect = (slug: string) => {
    // Redirect to /dining and pass category query parameter
    window.location.href = `/dining?category=${slug}`;
  };

  return (
    <div className="space-y-16 select-none border-t border-white/5 pt-28">
      {/* Header */}
      <div className="text-center space-y-4 max-w-2xl mx-auto">
        <div className="flex items-center justify-center gap-2.5">
          <Sparkles className="w-3.5 h-3.5 text-gold" />
          <span className="text-[10px] uppercase tracking-[0.35em] text-[#C8A97E] font-bold font-sans">
            06 // Culinary Catalog Preview
          </span>
        </div>
        <h2 className="font-serif text-3xl sm:text-5xl font-light text-white leading-tight">
          Explore Menu Categories
        </h2>
        <p className="text-xs sm:text-sm text-neutral-400 font-sans font-light leading-relaxed tracking-wide">
          Select a category to view individual dishes, pricing details, and place reservations.
        </p>
      </div>

      {/* Grid of Categories */}
      <motion.div
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-5%" }}
        variants={{
          hidden: {},
          show: {
            transition: {
              staggerChildren: 0.05
            }
          }
        }}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {CATEGORIES.map((cat, idx) => {
          const IconComp = cat.icon;
          return (
            <motion.div
              key={idx}
              variants={{
                hidden: { opacity: 0, y: 15 },
                show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } }
              }}
              whileHover={{ y: -5, borderColor: "rgba(223,186,115,0.25)" }}
              onClick={() => handleCategoryRedirect(cat.slug)}
              className="p-6 border border-white/5 bg-[#14161C]/50 backdrop-blur-sm rounded-xl flex flex-col gap-4 cursor-pointer transition-all duration-300 shadow-md group hover:bg-[#14161C]"
            >
              {/* Icon */}
              <div className="h-10 w-10 border border-[#DFBA73]/15 rounded-lg flex items-center justify-center bg-[#0F1115] text-[#DFBA73] group-hover:bg-[#DFBA73] group-hover:text-black group-hover:shadow-[0_0_15px_rgba(223,186,115,0.25)] transition-all duration-500 shrink-0">
                <IconComp className="h-4.5 w-4.5" />
              </div>

              <div className="space-y-1.5">
                <h4 className="font-serif text-sm font-semibold text-white tracking-wide group-hover:text-gold transition-colors duration-300">
                  {cat.title}
                </h4>
                <p className="text-[11px] text-neutral-400 font-sans font-light leading-relaxed">
                  {cat.desc}
                </p>
              </div>

              <div className="pt-2 text-[8px] font-sans font-bold uppercase tracking-widest text-[#DFBA73]/60 group-hover:text-gold transition-colors block">
                View Dishes →
              </div>
            </motion.div>
          );
        })}
      </motion.div>
    </div>
  );
}
