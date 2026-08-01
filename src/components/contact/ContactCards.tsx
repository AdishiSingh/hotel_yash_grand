import React from "react";
import { CONTACT_DATA } from "@/data/contact";
import { MapPin, Phone, Mail, Clock, ShieldAlert, Car } from "lucide-react";
import { motion } from "framer-motion";

export function ContactCards() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 select-none text-left">
      {/* 1. Address card */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="p-6 border border-white/5 bg-[#14161C]/50 rounded-xl space-y-3 hover:border-gold/15 transition-all duration-300"
      >
        <MapPin className="h-5 w-5 text-[#DFBA73]/80" />
        <div className="space-y-1">
          <h4 className="font-serif text-sm font-semibold text-white tracking-wide">Hotel Address</h4>
          <p className="text-[11px] text-neutral-400 font-sans font-light leading-relaxed select-text">
            {CONTACT_DATA.name} <br />
            {CONTACT_DATA.address} <br />
            PIN: {CONTACT_DATA.zipCode}
          </p>
        </div>
      </motion.div>

      {/* 2. Direct Contacts card */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.05 }}
        className="p-6 border border-white/5 bg-[#14161C]/50 rounded-xl space-y-3 hover:border-gold/15 transition-all duration-300"
      >
        <Phone className="h-5 w-5 text-[#DFBA73]/80" />
        <div className="space-y-1">
          <h4 className="font-serif text-sm font-semibold text-white tracking-wide">Reservations & Calls</h4>
          <div className="space-y-0.5 text-[11px] text-neutral-400 font-sans font-light select-text">
            {CONTACT_DATA.phones.map((phone, idx) => (
              <a key={idx} href={`tel:${phone.replace(/\s+/g, "")}`} className="block hover:text-gold transition-colors">
                • {phone} (Front Desk)
              </a>
            ))}
          </div>
        </div>
      </motion.div>

      {/* 3. Electronic Mail card */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="p-6 border border-white/5 bg-[#14161C]/50 rounded-xl space-y-3 hover:border-gold/15 transition-all duration-300"
      >
        <Mail className="h-5 w-5 text-[#DFBA73]/80" />
        <div className="space-y-1">
          <h4 className="font-serif text-sm font-semibold text-white tracking-wide">Email Inquiries</h4>
          <a href={`mailto:${CONTACT_DATA.email}`} className="text-[11px] text-neutral-400 font-sans font-light hover:text-gold transition-colors select-text block">
            {CONTACT_DATA.email}
          </a>
        </div>
      </motion.div>

      {/* 4. Reception timing card */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.15 }}
        className="p-6 border border-white/5 bg-[#14161C]/50 rounded-xl space-y-3 hover:border-gold/15 transition-all duration-300"
      >
        <Clock className="h-5 w-5 text-[#DFBA73]/80" />
        <div className="space-y-1">
          <h4 className="font-serif text-sm font-semibold text-white tracking-wide">Business Hours</h4>
          <p className="text-[11px] text-neutral-400 font-sans font-light leading-relaxed select-text">
            {CONTACT_DATA.businessHours}
          </p>
        </div>
      </motion.div>

      {/* 5. Emergency hotline card */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="p-6 border border-white/5 bg-[#14161C]/50 rounded-xl space-y-3 hover:border-gold/15 transition-all duration-300 col-span-1"
      >
        <ShieldAlert className="h-5 w-5 text-red-400/80" />
        <div className="space-y-1">
          <h4 className="font-serif text-sm font-semibold text-white tracking-wide">Duty Manager Emergency</h4>
          <a href={`tel:${CONTACT_DATA.emergencyPhone.replace(/\s+/g, "")}`} className="text-[11px] text-neutral-400 font-sans font-light hover:text-gold transition-colors select-text block">
            {CONTACT_DATA.emergencyPhone}
          </a>
        </div>
      </motion.div>

      {/* 6. Valet parking card */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.25 }}
        className="p-6 border border-white/5 bg-[#14161C]/50 rounded-xl space-y-3 hover:border-gold/15 transition-all duration-300 col-span-1"
      >
        <Car className="h-5 w-5 text-[#DFBA73]/80" />
        <div className="space-y-1">
          <h4 className="font-serif text-sm font-semibold text-white tracking-wide">Valet Parking</h4>
          <p className="text-[11px] text-neutral-400 font-sans font-light leading-relaxed select-text">
            {CONTACT_DATA.parkingInfo}
          </p>
        </div>
      </motion.div>
    </div>
  );
}
