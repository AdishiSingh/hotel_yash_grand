"use client";

import * as React from "react";
import { PartyPopper, Phone, MessageSquare, Check, X } from "lucide-react";

export default function ErpBanquetPage() {
  const [enquiries, setEnquiries] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);

  const fetchBanquets = async () => {
    try {
      const res = await fetch("/api/banquet");
      const json = await res.json();
      if (json.success && Array.isArray(json.data)) {
        setEnquiries(json.data);
      }
    } catch (err) {
      console.error("Failed to fetch banquet enquiries from API:", err);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchBanquets();
  }, []);

  const updateStatus = async (id: string, newStatus: string) => {
    try {
      setEnquiries((prev) =>
        prev.map((e) => (e.id === id ? { ...e, status: newStatus } : e))
      );
      await fetch(`/api/banquet/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      fetchBanquets();
    } catch (err) {
      console.error("Failed to update banquet status:", err);
    }
  };

  return (
    <div className="space-y-6 font-sans">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-6">
        <div>
          <h2 className="font-serif text-2xl font-semibold text-white">Banquet & Event Enquiries Manager</h2>
          <p className="text-xs text-neutral-400 font-light">
            Wedding halls, corporate conferences, and celebration booking pipeline.
          </p>
        </div>
      </div>

      {/* Banquet Inquiries Table */}
      <div className="border border-white/10 bg-neutral-950 rounded-xl overflow-hidden shadow-lux">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-neutral-900/80 text-neutral-400 border-b border-white/10 text-[10px] uppercase tracking-widest font-bold">
                <th className="p-4">Ref & Event Type</th>
                <th className="p-4">Organizer Details</th>
                <th className="p-4">Event Date & Guests</th>
                <th className="p-4">Budget & Notes</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-neutral-300">
              {enquiries.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-neutral-400 font-light">
                    {loading ? "Loading banquet enquiries from database..." : "No banquet enquiries found."}
                  </td>
                </tr>
              ) : (
                enquiries.map((enq) => (
                  <tr key={enq.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="p-4 space-y-1">
                      <span className="font-mono text-xs text-[#C5A880] font-bold block">{enq.enquiryId}</span>
                      <span className="font-serif text-sm text-white font-medium block">{enq.eventType}</span>
                    </td>
                    <td className="p-4 space-y-0.5">
                      <span className="font-medium text-white block">{enq.customerName}</span>
                      <span className="text-[10px] text-neutral-400 font-mono">{enq.customerPhone || enq.phone}</span>
                    </td>
                    <td className="p-4 space-y-1 font-mono">
                      <span className="text-white font-bold block">
                        {new Date(enq.eventDate || enq.date).toLocaleDateString()}
                      </span>
                      <span className="text-[10px] text-[#C5A880]">{enq.guestsCount || enq.guests} Guests</span>
                    </td>
                    <td className="p-4 space-y-1">
                      <span className="font-mono text-xs text-[#C5A880] font-bold block">
                        ₹{(enq.budget || 0).toLocaleString()}
                      </span>
                      <p className="text-[10px] text-neutral-400 font-light truncate max-w-[180px]">
                        {enq.specialRequirements || "None"}
                      </p>
                    </td>
                    <td className="p-4">
                      <span
                        className={`px-2.5 py-1 rounded-sm text-[9.5px] uppercase tracking-widest font-bold border ${
                          enq.status === "NEW"
                            ? "bg-amber-950/80 border-amber-500/30 text-amber-300 animate-pulse"
                            : enq.status === "BOOKED" || enq.status === "CONFIRMED"
                            ? "bg-emerald-950/80 border-emerald-500/30 text-emerald-300"
                            : enq.status === "CONTACTED" || enq.status === "SITE_VISIT"
                            ? "bg-blue-950/80 border-blue-500/30 text-blue-300"
                            : "bg-neutral-900 border-white/10 text-neutral-400"
                        }`}
                      >
                        {enq.status}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex gap-1.5 justify-end flex-wrap">
                        <a
                          href={`https://wa.me/${(enq.customerPhone || enq.phone || "").replace(/[^0-9]/g, "")}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-2 py-1.5 bg-[#25D366] text-black font-bold text-[10px] uppercase rounded-sm flex items-center gap-1 cursor-pointer"
                          title="WhatsApp Customer"
                        >
                          <MessageSquare className="h-3 w-3" />
                          <span>WhatsApp</span>
                        </a>

                        {enq.status !== "CONTACTED" && (
                          <button
                            onClick={() => updateStatus(enq.id, "CONTACTED")}
                            className="px-2 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-sm text-[10px] font-bold uppercase tracking-wider cursor-pointer"
                          >
                            Contact
                          </button>
                        )}

                        {enq.status !== "BOOKED" && enq.status !== "CONFIRMED" && (
                          <button
                            onClick={() => updateStatus(enq.id, "BOOKED")}
                            className="px-2 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-sm text-[10px] font-bold uppercase tracking-wider cursor-pointer"
                          >
                            Confirm
                          </button>
                        )}

                        {enq.status !== "CANCELLED" && enq.status !== "REJECTED" && (
                          <button
                            onClick={() => updateStatus(enq.id, "CANCELLED")}
                            className="px-2 py-1.5 bg-red-600/80 hover:bg-red-500 text-white rounded-sm text-[10px] font-bold uppercase tracking-wider cursor-pointer"
                          >
                            Reject
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
