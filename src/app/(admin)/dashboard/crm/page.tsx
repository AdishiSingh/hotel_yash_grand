"use client";

import * as React from "react";
import { Users, Award, Star, Phone, Mail, Search } from "lucide-react";

export default function ErpCrmPage() {
  const [customers, setCustomers] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [searchQuery, setSearchQuery] = React.useState("");

  const fetchCustomers = async (query?: string) => {
    try {
      const url = query ? `/api/customers?query=${encodeURIComponent(query)}` : "/api/customers";
      const res = await fetch(url);
      const json = await res.json();
      if (json.success && Array.isArray(json.data)) {
        setCustomers(json.data);
      }
    } catch (err) {
      console.error("Failed to fetch CRM customers from API:", err);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchCustomers();
  }, []);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setSearchQuery(val);
    fetchCustomers(val);
  };

  return (
    <div className="space-y-6 font-sans">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-6">
        <div>
          <h2 className="font-serif text-2xl font-semibold text-white">Customer Relationship Management (CRM)</h2>
          <p className="text-xs text-neutral-400 font-light">
            Database guest visit profiles: automatically generated from food orders, room stays, and banquet bookings.
          </p>
        </div>

        <div className="relative">
          <Search className="h-4 w-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by name or phone..."
            value={searchQuery}
            onChange={handleSearch}
            className="pl-9 pr-4 py-2 bg-neutral-900 border border-white/10 rounded-lg text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-[#C5A880] w-64"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {customers.length === 0 ? (
          <div className="col-span-full border border-white/10 bg-neutral-950 p-12 text-center rounded-xl text-neutral-400">
            {loading ? "Loading customer profiles from database..." : "No guest profiles found matching your search."}
          </div>
        ) : (
          customers.map((cust) => (
            <div
              key={cust.id}
              className="border border-white/10 bg-neutral-950 p-6 rounded-xl space-y-4 shadow-lux"
            >
              <div className="flex justify-between items-start border-b border-white/10 pb-3">
                <div>
                  <span className="font-serif text-lg font-semibold text-white block">{cust.name}</span>
                  <span className="text-[10px] text-neutral-400 font-mono">{cust.phone}</span>
                </div>

                {cust.isReturning && (
                  <span className="px-2.5 py-1 bg-[#C5A880]/15 border border-[#C5A880]/30 text-[#C5A880] text-[9px] uppercase tracking-widest font-bold rounded-sm flex items-center gap-1">
                    <Award className="h-3 w-3" />
                    <span>VIP Guest</span>
                  </span>
                )}
              </div>

              <div className="space-y-2 text-xs">
                <div className="flex justify-between text-neutral-400">
                  <span>Lifetime Total Spent:</span>
                  <span className="font-mono text-[#C5A880] font-bold text-sm">₹{(cust.totalSpent || 0).toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-neutral-400">
                  <span>Total Stay & Dine Visits:</span>
                  <span className="font-mono text-white font-bold">{cust.visitCount || 1} Visits</span>
                </div>
                <div className="flex justify-between text-neutral-400">
                  <span>Last Hotel Visit:</span>
                  <span className="font-mono text-neutral-300">
                    {cust.lastVisit ? new Date(cust.lastVisit).toLocaleDateString() : "Recent"}
                  </span>
                </div>
              </div>

              {Array.isArray(cust.favouriteDishes) && cust.favouriteDishes.length > 0 && (
                <div className="pt-2 border-t border-white/10 space-y-1">
                  <span className="text-[9.5px] uppercase tracking-widest text-[#C5A880] font-bold block">
                    Favourite Order Items:
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {cust.favouriteDishes.map((dish: string, i: number) => (
                      <span key={i} className="px-2 py-0.5 bg-neutral-900 border border-white/10 rounded-sm text-[10px] text-neutral-300">
                        {dish}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
