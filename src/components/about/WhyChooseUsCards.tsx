import React from "react";
import { Bed, Utensils, Award, MapPin, Users, Sparkles, Car, Heart } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

const FEATURES = [
  {
    icon: Bed,
    title: "Luxury Rooms",
    desc: "Bespoke suites finished in solid walnut wood and fine marble, designed for deep relaxation."
  },
  {
    icon: Utensils,
    title: "Family Restaurant",
    desc: "Varanasi's premier multi-cuisine Veg & Non-Veg dining experience with private seating."
  },
  {
    icon: Award,
    title: "Premium Banquet Hall",
    desc: "The Grand Ballroom holding up to 500 guests with state-of-the-art acoustics."
  },
  {
    icon: MapPin,
    title: "Prime Location",
    desc: "Conveniently situated near SMS College, offering easy access to both ghats and city hubs."
  },
  {
    icon: Users,
    title: "Professional Hospitality",
    desc: "A dedicated crew trained in traditional hospitality, offering personalized 24/7 care."
  },
  {
    icon: Sparkles,
    title: "Fresh & Authentic Cuisine",
    desc: "Pure ingredients sourced daily to prepare North Indian, Chinese, and regional delicacies."
  },
  {
    icon: Car,
    title: "Large Parking",
    desc: "Safe, secure, and spacious on-site valet parking for up to 100+ vehicles."
  },
  {
    icon: Heart,
    title: "Weddings & Celebrations",
    desc: "A complete setup offering bridal suites, decor integration, and gourmet catering."
  }
];

export function WhyChooseUsCards() {
  return (
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
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 select-none"
    >
      {FEATURES.map((feat, idx) => {
        const IconComp = feat.icon;
        return (
          <motion.div
            key={idx}
            variants={{
              hidden: { opacity: 0, y: 15 },
              show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } }
            }}
            whileHover={{ y: -5, borderColor: "rgba(212, 175, 55, 0.25)" }}
            className="p-6 border border-white/5 bg-[#14161C]/50 backdrop-blur-md rounded-xl flex flex-col gap-4 transition-all duration-300 shadow-lux group hover:bg-[#14161C]"
          >
            {/* Gold icon casing */}
            <div className="h-10 w-10 border border-[#DFBA73]/15 rounded-lg flex items-center justify-center bg-[#0F1115] text-[#DFBA73] group-hover:bg-[#DFBA73] group-hover:text-black group-hover:shadow-[0_0_15px_rgba(223,186,115,0.25)] transition-all duration-500 shrink-0">
              <IconComp className="h-4.5 w-4.5" />
            </div>

            <div className="space-y-2">
              <h4 className="font-serif text-sm font-semibold text-white tracking-wide">
                {feat.title}
              </h4>
              <p className="text-[11px] text-neutral-400 font-sans font-light leading-relaxed">
                {feat.desc}
              </p>
            </div>
          </motion.div>
        );
      })}
    </motion.div>
  );
}
