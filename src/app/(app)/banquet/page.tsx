import { BanquetCatalog } from "@/features/banquet/components/BanquetCatalog";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "The Grand Ballroom | Wedding Venue Varanasi | Hotel Yash Grand",
  description: "Book the Grand Ballroom at Hotel Yash Grand, Varanasi for weddings, receptions, corporate events, and birthday celebrations. View packages and verify availability instantly.",
};

export default function BanquetPage() {
  return (
    <div className="min-h-screen pt-16 bg-background">
      {/* Banquet Showcase Catalog */}
      <BanquetCatalog />
    </div>
  );
}
