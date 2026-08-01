"use client";

import * as React from "react";
import { Star, MessageSquare, Trash2, CheckCircle2 } from "lucide-react";

export default function ErpReviewsPage() {
  const [reviews, setReviews] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);

  const fetchReviews = async () => {
    try {
      const res = await fetch("/api/reviews");
      const json = await res.json();
      if (json.success && Array.isArray(json.data)) {
        setReviews(json.data);
      }
    } catch (err) {
      console.error("Failed to fetch reviews from API:", err);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchReviews();
  }, []);

  const handleReply = async (id: string) => {
    const text = prompt("Enter official response from HOTEL YASH GRAND Management:");
    if (text) {
      try {
        setReviews((prev) =>
          prev.map((r) => (r.id === id ? { ...r, reply: text } : r))
        );
        await fetch(`/api/reviews/${id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ reply: text }),
        });
        fetchReviews();
      } catch (err) {
        console.error("Failed to post review reply:", err);
      }
    }
  };

  return (
    <div className="space-y-6 font-sans">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-6">
        <div>
          <h2 className="font-serif text-2xl font-semibold text-white">Guest Reviews & Feedback Management</h2>
          <p className="text-xs text-neutral-400 font-light">
            Monitor guest ratings, respond to feedback, and manage homepage feature highlights.
          </p>
        </div>
      </div>

      <div className="space-y-4">
        {reviews.length === 0 ? (
          <div className="border border-white/10 bg-neutral-950 p-12 text-center rounded-xl text-neutral-400">
            {loading ? "Loading database guest reviews..." : "No guest reviews submitted yet."}
          </div>
        ) : (
          reviews.map((rev) => (
            <div key={rev.id} className="border border-white/10 bg-neutral-950 p-6 rounded-xl space-y-3 shadow-lux">
              <div className="flex justify-between items-start">
                <div>
                  <span className="font-serif text-base font-semibold text-white block">{rev.author}</span>
                  <span className="text-[10px] text-neutral-400 font-mono">
                    {new Date(rev.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex items-center gap-1 text-[#C5A880]">
                  {Array.from({ length: rev.rating || 5 }).map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-current" />
                  ))}
                </div>
              </div>

              <p className="text-xs text-neutral-300 font-light leading-relaxed select-text">
                &quot;{rev.comment}&quot;
              </p>

              {rev.reply && (
                <div className="p-3 bg-neutral-900 border border-white/5 rounded-lg text-xs text-[#C5A880] space-y-0.5">
                  <span className="font-bold text-[10px] uppercase tracking-wider block">Official Management Reply:</span>
                  <p className="text-neutral-300 font-light">&quot;{rev.reply}&quot;</p>
                </div>
              )}

              <div className="pt-2 flex justify-end gap-2">
                <button
                  onClick={() => handleReply(rev.id)}
                  className="px-3 py-1.5 bg-neutral-900 hover:bg-[#C5A880] text-neutral-300 hover:text-black border border-white/10 rounded-sm text-[10px] font-bold uppercase tracking-wider cursor-pointer"
                >
                  Reply to Review
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
