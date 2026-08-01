"use client";

import * as React from "react";
import { Mail, CheckCircle, Clock } from "lucide-react";

export default function ErpEnquiriesPage() {
  const [messages, setMessages] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);

  const fetchEnquiries = async () => {
    try {
      const res = await fetch("/api/contact");
      const json = await res.json();
      if (json.success && Array.isArray(json.data)) {
        setMessages(json.data);
      }
    } catch (err) {
      console.error("Failed to fetch contact enquiries from API:", err);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchEnquiries();
  }, []);

  const markStatus = async (id: string, status: string) => {
    try {
      setMessages((prev) =>
        prev.map((m) => (m.id === id ? { ...m, status } : m))
      );
      await fetch(`/api/contact/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      fetchEnquiries();
    } catch (err) {
      console.error("Failed to update enquiry status:", err);
    }
  };

  return (
    <div className="space-y-6 font-sans">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-6">
        <div>
          <h2 className="font-serif text-2xl font-semibold text-white">Contact Website Enquiries</h2>
          <p className="text-xs text-neutral-400 font-light">
            Inbound messages submitted via website contact portal.
          </p>
        </div>
      </div>

      <div className="border border-white/10 bg-neutral-950 rounded-xl overflow-hidden shadow-lux">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-neutral-900/80 text-neutral-400 border-b border-white/10 text-[10px] uppercase tracking-widest font-bold">
              <th className="p-4">Sender & Phone</th>
              <th className="p-4">Subject & Message</th>
              <th className="p-4">Received Date</th>
              <th className="p-4">Status</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5 text-neutral-300">
            {messages.length === 0 ? (
              <tr>
                <td colSpan={5} className="p-8 text-center text-neutral-400 font-light">
                  {loading ? "Loading database enquiries..." : "No website enquiries submitted yet."}
                </td>
              </tr>
            ) : (
              messages.map((m) => (
                <tr key={m.id} className="hover:bg-white/[0.02] transition-colors">
                  <td className="p-4 space-y-0.5">
                    <span className="font-medium text-white block">{m.name}</span>
                    <span className="text-[10px] text-neutral-400 font-mono">{m.phone}</span>
                  </td>
                  <td className="p-4 text-neutral-300 max-w-md select-text leading-relaxed">
                    {m.subject && <span className="font-bold text-[#C5A880] block text-[11px]">{m.subject}</span>}
                    {m.message}
                  </td>
                  <td className="p-4 font-mono text-neutral-400">
                    {new Date(m.createdAt).toLocaleDateString()}
                  </td>
                  <td className="p-4">
                    <span className={`px-2.5 py-1 rounded-sm text-[9px] uppercase tracking-widest font-bold border ${m.status === "UNREAD" ? "bg-amber-950/80 border-amber-500/30 text-amber-300" : "bg-neutral-900 border-white/10 text-neutral-400"}`}>
                      {m.status}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    {m.status === "UNREAD" && (
                      <button
                        onClick={() => markStatus(m.id, "RESOLVED")}
                        className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[9px] uppercase rounded-sm cursor-pointer"
                      >
                        Mark Resolved
                      </button>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
