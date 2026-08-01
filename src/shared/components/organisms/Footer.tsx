"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { ASSET_MANIFEST } from "@/shared/lib/asset-manifest";
import { useIntroStore } from "@/shared/store/use-intro-store";
import { motion } from "framer-motion";
import { Phone, Mail, MapPin, ArrowRight } from "lucide-react";
import { InstagramIcon } from "@/shared/components/icons/InstagramIcon";
import { Button } from "@/components/ui/button";

const Instagram = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
  </svg>
);

const Facebook = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
  </svg>
);

const Twitter = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
  </svg>
);

const Youtube = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17z" />
    <polygon points="10 15 15 12 10 9" />
  </svg>
);

export function Footer() {
  const phase = useIntroStore((state) => state.phase);
  const [email, setEmail] = React.useState("");

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    alert(`Thank you for subscribing with ${email}.`);
    setEmail("");
  };

  if (phase !== "landing") return null;

  return (
    <footer className="w-full bg-[#0F1115] text-[#F8F8F8] border-t border-white/5 relative z-10 font-sans">
      
      {/* 1. Google Maps Bleed Integration */}
      <div className="w-full h-[300px] relative filter grayscale invert contrast-125 opacity-40 hover:opacity-75 transition-opacity duration-700">
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3606.8122396349386!2d82.97391781501174!3d25.317645183842998!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x398e2db7bf0f9d9f%3A0x6b1076b6d51a9e34!2sSchool%20of%20Management%20Sciences!5e0!3m2!1sen!2sin!4v1689325983792!5m2!1sen!2sin"
          width="100%"
          height="100%"
          style={{ border: 0 }}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          title="Hotel Yash Grand Varanasi Location Map"
        />
        {/* Soft Gold overlay frame */}
        <div className="absolute inset-0 pointer-events-none border-b border-gold/15 bg-gradient-to-t from-[#0F1115] to-transparent" />
      </div>

      <div className="max-w-7xl mx-auto px-6 md:px-12 py-20">
        
        {/* 4-Column Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 pb-16 border-b border-white/5">
          
          {/* Column 1: Identity & Newsletter */}
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="relative h-10 w-10 overflow-hidden bg-neutral-900 border border-gold/30 p-0.5 rounded-sm">
                <Image
                  src={ASSET_MANIFEST.logo.primary}
                  alt="Hotel Yash Grand Footer Brand Logo"
                  fill
                  sizes="40px"
                  className="object-cover"
                />
              </div>
              <div className="flex flex-col">
                <span className="font-serif text-sm tracking-[0.15em] font-medium text-white uppercase">
                  Yash Grand
                </span>
                <span className="text-[7.5px] uppercase tracking-[0.3em] text-[#C8A97E] font-sans font-semibold">
                  Varanasi
                </span>
              </div>
            </div>
            <p className="text-xs text-[#A9A9A9] font-light leading-relaxed">
              Experience signature Indian hospitality near SMS College, Varanasi. Relax in bespoke rooms and host grand affairs in our ballroom.
            </p>

            {/* Newsletter Form */}
            <form onSubmit={handleSubscribe} className="space-y-2.5 pt-2">
              <h5 className="text-[9px] uppercase tracking-widest text-[#C8A97E] font-bold">Join the Chronicle</h5>
              <div className="flex gap-2">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="email@example.com"
                  required
                  className="bg-[#171A21]/80 border border-white/5 text-xs text-white px-3 py-2 focus:outline-none focus:border-gold/50 rounded-sm flex-1 font-sans"
                />
                <button
                  type="submit"
                  className="p-2 bg-gold hover:bg-[#8B5E3C] text-black hover:text-white transition-colors duration-500 rounded-sm cursor-pointer"
                  aria-label="Subscribe"
                >
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </form>
          </div>

          {/* Column 2: Quick Links */}
          <div className="space-y-4">
            <h4 className="text-[10.5px] uppercase tracking-[0.2em] font-bold text-gold font-buttons">Quick Links</h4>
            <nav className="flex flex-col gap-3 text-xs text-[#A9A9A9] font-light">
              <Link href="/" className="hover:text-gold transition-colors">Home</Link>
              <Link href="/rooms" className="hover:text-gold transition-colors">Our Rooms</Link>
              <Link href="/dining" className="hover:text-gold transition-colors">Restaurant</Link>
              <Link href="/banquet" className="hover:text-gold transition-colors">Banquet Halls</Link>
              <Link href="/gallery" className="hover:text-gold transition-colors">Photo Gallery</Link>
            </nav>
          </div>

          {/* Column 3: Hours & Support */}
          <div className="space-y-4 font-sans font-light">
            <h4 className="text-[10.5px] uppercase tracking-[0.2em] font-bold text-gold font-buttons">Opening Hours</h4>
            <div className="text-xs text-[#A9A9A9] space-y-2">
              <p className="flex justify-between border-b border-white/5 pb-1">
                <span>Restaurant</span>
                <span className="font-semibold text-white">11:30 AM - 11:30 PM</span>
              </p>
              <p className="flex justify-between border-b border-white/5 pb-1">
                <span>Room Service</span>
                <span className="font-semibold text-white">24 / 7 Available</span>
              </p>
              <p className="flex justify-between">
                <span>Banquet Inquiries</span>
                <span className="font-semibold text-white">10:00 AM - 8:00 PM</span>
              </p>
            </div>
            
            <div className="pt-2">
              <h5 className="text-[9px] uppercase tracking-widest text-[#C8A97E] font-bold mb-2">Internal Portals</h5>
              <div className="flex flex-col gap-1.5 text-xs text-[#A9A9A9]">
                <Link href="/admin" className="hover:text-gold transition-colors">Staff Operations Control</Link>
                <Link href="/pos" className="hover:text-gold transition-colors">Captain Ordering Terminal</Link>
              </div>
            </div>
          </div>

          {/* Column 4: Contact & Socials */}
          <div className="space-y-6">
            <div className="space-y-4">
              <h4 className="text-[10.5px] uppercase tracking-[0.2em] font-bold text-gold font-buttons">Contact</h4>
              <div className="space-y-3 text-xs text-[#A9A9A9] font-light">
                <a 
                  href="https://goo.gl/maps/yashgrandvaranasi" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-start gap-2.5 hover:text-gold transition-colors py-1 cursor-pointer group"
                >
                  <MapPin className="h-4 w-4 text-gold shrink-0 mt-0.5 group-hover:scale-110 transition-transform" />
                  <span className="leading-relaxed">Near SMS College, Varanasi, UP - 221011</span>
                </a>
                <a 
                  href="tel:+919151088115"
                  className="flex items-center gap-2.5 hover:text-gold transition-colors py-1 cursor-pointer group"
                >
                  <Phone className="h-4 w-4 text-gold shrink-0 group-hover:scale-110 transition-transform" />
                  <span>+91 91510 88115 / +91 99999 99999</span>
                </a>
                <a 
                  href="mailto:reservations@yashgrand.com"
                  className="flex items-center gap-2.5 hover:text-gold transition-colors py-1 cursor-pointer group"
                >
                  <Mail className="h-4 w-4 text-gold shrink-0 group-hover:scale-110 transition-transform" />
                  <span>reservations@yashgrand.com</span>
                </a>
              </div>
            </div>

            {/* Social Icons */}
            <div className="space-y-2">
              <h5 className="text-[9px] uppercase tracking-widest text-[#C8A97E] font-bold">Social Connect</h5>
              <div className="flex gap-2.5 text-neutral-400">
                <a 
                  href="https://www.instagram.com/yashgrand03nov?igsh=MXNjOTRoajMxdWF4cg==" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="h-11 w-11 min-h-[44px] min-w-[44px] flex items-center justify-center rounded-sm bg-neutral-900/60 border border-white/5 hover:border-gold/40 hover:text-gold hover:-translate-y-0.5 transition-all duration-[250ms] cursor-pointer" 
                  aria-label="Visit HOTEL YASH GRAND on Instagram"
                >
                  <InstagramIcon className="h-4 w-4" />
                </a>
                <a href="#" className="h-11 w-11 min-h-[44px] min-w-[44px] flex items-center justify-center rounded-sm bg-neutral-900/60 border border-white/5 hover:border-gold/40 hover:text-gold hover:-translate-y-0.5 transition-all duration-[250ms]" aria-label="Facebook"><Facebook className="h-4 w-4" /></a>
                <a href="#" className="h-11 w-11 min-h-[44px] min-w-[44px] flex items-center justify-center rounded-sm bg-neutral-900/60 border border-white/5 hover:border-gold/40 hover:text-gold hover:-translate-y-0.5 transition-all duration-[250ms]" aria-label="Twitter"><Twitter className="h-4 w-4" /></a>
                <a href="#" className="h-11 w-11 min-h-[44px] min-w-[44px] flex items-center justify-center rounded-sm bg-neutral-900/60 border border-white/5 hover:border-gold/40 hover:text-gold hover:-translate-y-0.5 transition-all duration-[250ms]" aria-label="Youtube"><Youtube className="h-4 w-4" /></a>
              </div>
            </div>
          </div>

        </div>

        {/* Timeless Founder Signature Band */}
        <div className="pt-12 pb-4 text-center flex flex-col items-center justify-center space-y-1 select-text">
          <span className="text-[10px] sm:text-[11px] uppercase tracking-[0.25em] text-[#C5A880]/75 font-sans font-normal">
            Family-owned Hospitality
          </span>
          <span className="text-[11px] sm:text-xs md:text-[13px] uppercase tracking-[0.28em] text-[#C5A880]/80 font-sans font-normal">
            Founded by Mr. Dharmpal Singh
          </span>
        </div>

        {/* Lower copyright band */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6 pt-8 text-[9px] text-neutral-500 uppercase tracking-widest border-t border-white/5">
          <span>© {new Date().getFullYear()} Hotel Yash Grand. All Rights Reserved.</span>
          <div className="flex gap-6">
            <a href="#" className="hover:text-gold">Privacy Policy</a>
            <span>{"//"}</span>
            <a href="#" className="hover:text-gold">Terms & Conditions</a>
          </div>
        </div>

      </div>
    </footer>
  );
}
