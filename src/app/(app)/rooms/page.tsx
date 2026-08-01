import { RoomCatalog } from "@/features/booking/components/RoomCatalog";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Suites & Sanctums | Hotel Yash Grand Varanasi",
  description: "Browse and book luxury rooms and suites at Hotel Yash Grand, Varanasi. Explore detailed configurations, prices, privileges, and virtual tours.",
};

export default function RoomsPage() {
  return (
    <div className="min-h-screen pt-16 bg-background">
      {/* Rooms Showcase Catalog */}
      <RoomCatalog />
    </div>
  );
}
